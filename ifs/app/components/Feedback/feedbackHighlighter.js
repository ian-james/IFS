var _ = require('lodash');
var path = require('path');
var XRegExp = require('xregexp');
var buttonMaker = require('./createTextButton');
var FileParser = require('./parsers/writingParser.js').FileParser;
var Logger = require( __configs + "loggingConfig");
var he = require("he");

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

    //TODO: CHecking word boundaries might cause problems for tools that are given us ranges that include
    // partial words and spaces. However, word boundaries are more useful and cause less issues.
    if( def.target.trim() != 0 && targetOptions.toolType == "writing")
        def.regex = new XRegExp( "\\b" + escapeRegExp(def.target) + "\\b" , def.flags );
    else
        def.regex = new XRegExp( escapeRegExp(def.target) , def.flags );
        
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

/* Function to compare two feedback items positional information
   Programming checks line otherwise lineNum and word or char Num
*/
function checkErrorPositionOverlap( cItem, nItem ) {
    var r = false;
    if( cItem && nItem ){
        var requiresOnlyLine = cItem.runType == nItem.runType && cItem.runType == "programming";
        r = requiresOnlyLine && cItem.lineNum == nItem.lineNum;
        r = r || (cItem.wordNum && nItem.wordNum && cItem.lineNum == nItem.lineNum);
        r  = r || cItem.charNum == nItem.charNum;
    }
    return r;
}

function checkErrorOverlap( feedbackItems, feedbackIndex ) {
   // Check whether next item will match, identify multiError on same word
    var nextItem = (feedbackIndex+1<feedbackItems.length) ? feedbackItems[feedbackIndex+1] : null;
    var feedbackItem = feedbackItems[feedbackIndex];

    var matches = false;
    if(nextItem) {
        matches = checkErrorPositionOverlap(feedbackItem, nextItem );
        if( matches) {
            if( feedbackItem.target != nextItem.target ) {
                return false;
            }
        }
    }
    return matches;
}


/* Markup a single file by plaing only feedback Items from a specific tool into the file */
function markupFile( file, selectedTool, feedbackItems )
{
    var content = file.content;
    var offset = 0;

    var nextItem = null;
    var idArr = [];
    var matchClasses = "";

    for( var i = 0; i < feedbackItems.length; i++ )
    {
        var feedbackItem = feedbackItems[i];
        // Check for a specific tool and specific filename or all
        if( filesMatch(file.originalname, feedbackItem.filename)  &&  toolsMatch(feedbackItem.toolName,selectedTool ) )
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
            // Assumption should probably change
            var nextMatches =  checkErrorOverlap(feedbackItems, i );

            if( nextMatches ) {
                // We have multiple errors on this word.
                matchClasses = " multiError";
            }

            idArr.push(i)
            if(!nextMatches)
            {
                // Assign either the multiError or the specific error type.
                // Also an array for the feedback Items array that match this error
                matchClasses =   matchClasses == "" ? feedbackItems[i].type : matchClasses;

                //TODO JF: This helps fixes an issue, but keeping i vs idarr as it potentially reduces functionality but that functionality
                //      Might be deprecated soon too. Essentially old method allows moving between errors on the readMore. This
                //      fix remove that capability.
                //OLD var options = { 'classes': matchClasses, 'data': idArr , 'id': idArr, 'feedbackId':feedbackItems[i].id};
                var options = { 'classes': matchClasses, 'data': idArr , 'id': i, 'feedbackId':feedbackItems[i].id};

                // Create a popover button at position to highlight text and count the offset.
                // woops wont work with html sucks to suck
                var newStr = buttonMaker.createTextButton(feedbackItem, options);
                newStr.mid = newStr.mid.replace(/(<([^>]+)>)/ig,"");
                var str = newStr.start + newStr.mid + newStr.end;
                var contentObj = replaceText( content, {'needle':feedbackItem.target, 'newText':str, 'flags':"gm", 'targetPos': feedbackItem.charNum+offset, toolType: feedbackItem.runType } );

                content = contentObj.content;
                offset += ( (str.length  - newStr.mid.length ) + contentObj.offset);
                idArr = [];

                // Reset data
                matchClasses = "";
            }
        }
    }
    return content;
}


module.exports.replaceText = replaceText;
module.exports.markupFile = markupFile;
