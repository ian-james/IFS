var _ = require('lodash');
var path = require('path');
var XRegExp = require('xregexp');
var buttonMaker = require('./createTextButton');
var FileParser = require('./feedbackParser').FileParser;

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function setupRegExp( targetOptions )
{
    var def = {
        'target':       targetOptions.needle || "",
        'targetPos':    targetOptions.targetPos ||   0 ,
        'flags':        targetOptions.flags || "m",
        'regex':        targetOptions.regex || null,
        'newText':      targetOptions.newText || ""
    };
    def.regex = new XRegExp(escapeRegExp(def.target), def.flags );
    return def;
}

function handleRegExp( str, targetOpt, func ) {

    var regExp = setupRegExp( targetOpt );

    if(_.isNil(regExp) || _.isNil(regExp.target) || regExp.target == "" ) {
        return null;
    }

    return func(regExp);
}

function filesMatch( filename, feedbackFilename, usePath = false) {

    if( usePath )
        return filename == feedbackFilename;

    return path.basename(filename) == path.basename(feedbackFilename);

}

function toolsMatch( toolName, selectedToolName ) {
    return ( selectedToolName == "All" || toolName == selectedToolName );
}

function replaceText(str, targetOpt )
{
    return  handleRegExp(str, targetOpt, function(regExp) {

        var offset = 0;
        // Check the exact position if could search for closest but not sure if that is ideal
        if( XRegExp.test( str, regExp.regex, targetOpt.targetPos, true ) ) {
            str = str.substr(0, targetOpt.targetPos) + regExp.newText + str.substr(targetOpt.targetPos + targetOpt.needle.length );
        }
        else {
            var closestIdx = -1;
            var closestValue = Math.MAX_SAFE_INTEGER;
            var matchFound = false;

            /* This code is a fall back to the intial if-statement for search and replace
                Since our tools should give accuracte positional information
                when we don't have accurate information (possibly only off by a couple)

                We search and find the closest position for the target RE
                We then replace that string and account for the difference in offset
                between the expected position and actual position.

                Assuming that all other feedback positional information will need
                that same adjustment, we pass the adjustment offset back so that
                the positional search can match the difference between's the tools
                position and the actual position.

                Thus reducing the need for constantly research for minor positional errors.
            */
            var res = XRegExp.replace( str, regExp.regex, function(match,index) {

                if( index == targetOpt.targetPos ) {
                    matchFound = true;
                    return regExp.newText;
                }
                if ( closestValue == Math.MAX_SAFE_INTEGER || Math.abs( targetOpt.targetPos - index ) < closestValue ) {
                    closestValue = Math.abs( targetOpt.targetPos - index );
                    closestIdx =  index;
                }
                return match;
            });


            if( !matchFound && closestIdx >= 0 )
            {
                if( XRegExp.test( str, regExp.regex, closestIdx, true ) ) {
                    str = str.substr(0, closestIdx) + regExp.newText + str.substr(closestIdx + targetOpt.needle.length );
                    offset =  closestIdx - targetOpt.targetPos
                }
            }
        }
        return { content:str, offset: offset };
    });
}

function setupFilePositionInformation(file, selectedTool, feedbackItems) {

    var fileParser = new FileParser();
    fileParser.setupContent( file.content );
    fileParser.tokenize();

    // Setup positionsal information for all
    for( var i = 0; i < feedbackItems.length; i++ ) {

        var feedbackItem = feedbackItems[i];
        if( filesMatch(file.originalname, feedbackItem.filename)  &&  toolsMatch(selectedTool,feedbackItem.toolName ) )
        {
            if( !feedbackItem.filename || !feedbackItem.lineNum )
            {
                // TODO: This should be handed a generic or global error system.
                continue;
            }

            // Try to fill out positional information first.
            if( !feedbackItem.charNum ) {
                feedbackItem.charNum = fileParser.getCharNumFromLineNumCharPos(feedbackItem);
            }

            // Without a target you have to use the line or a range
            if( !feedbackItem.target ) {
                if( feedbackItem.hlBegin ) {
                    // Section to highlight
                    feedbackItem.target = fileParser.getRange( feedbackItem );
                }
                else if( feedbackItem.charPos ) {
                    // You can get a target better than the line.
                    feedbackItem.target = fileParser.getLineSection( feedbackItem );
                }
                if(!feedbackItem.target) {
                    feedbackItem.target = fileParser.getLine(feedbackItem,false);
                }
            }
        }
    }
}



/* Markup a single file by plaing only feedback Items from a specific tool into the file */
function markupFile( file, selectedTool, feedbackItems )
{
    var content = file.content;
    var offset = 0;

    var nextItem = null;
    var idArr = [];
    var matchClasses = "";

    setupFilePositionInformation(file, selectedTool,feedbackItems);

    for( var i = 0; i < feedbackItems.length; i++ )
    {
        var feedbackItem = feedbackItems[i];

        // Check for a specific tool and specific filename or all
        if( filesMatch(file.originalname, feedbackItem.filename)  &&  toolsMatch(selectedTool,feedbackItem.toolName ) )
        {
                // Most have line number and character position.
                // Interestingly, calculating this value can give different answers...
                // I think it depends on line-breaks.
                // Momementarily setting this to always run.
            if( !feedbackItem.filename || !feedbackItem.target ) {
                // TODO: This should be handed a generic or global error system.
                continue;
            }
            else if( feedbackItem.lineNum == undefined || feedbackItem.charNum == undefined ){
                // Previously tried to setup positional information and failed.
                continue;
            }

            // Check whether next item will match, identify multiError on same word
            nextItem = (i+1<feedbackItems.length) ? feedbackItems[i+1] : null;

            var nextMatches =  nextItem && nextItem.target == feedbackItem.target
                             && nextItem.wordNum == feedbackItem.wordNum
                             && nextItem.lineNum == feedbackItem.lineNum;

            if( nextMatches ) {
                // We have multiple errors on this word.
                matchClasses = " multiError";
            }

            idArr.push(i);
            if(!nextMatches)
            {
                // Assign either the multiError or the specific error type.
                // Also an array for the feedback Items array that match this error
                matchClasses =   matchClasses == "" ? feedbackItems[i].type : matchClasses;
                var options = { 'classes': matchClasses, 'data': idArr };

                // Create a popover button at position to highlight text and count the offset.
                var newStr = buttonMaker.createTextButton(feedbackItem, options);
                var str = newStr.start + newStr.mid + newStr.end;
                var contentObj = replaceText( content, {'needle':feedbackItem.target, 'newText':str, 'flags':"gm", 'targetPos': feedbackItem.charNum+offset } );
                content = contentObj.content;
                offset += ( (str.length  - newStr.mid.length + 1 ) + contentObj.offset);

                // Reset data
                matchClasses = "";
                idArr = [];
            }
        }
    }
    return content;
}


module.exports.replaceText = replaceText;
module.exports.markupFile = markupFile;

