var _ = require('lodash');
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

    if(_.isNil(regExp) || _.isNil(regExp.target) || regExp.target == "" )
        return null;

    return func(regExp);
}

function replaceText(str, targetOpt )
{
    return  handleRegExp(str, targetOpt, function(regExp) {

        // Check the exact position if could search for closest but not sure if that is ideal
        if( XRegExp.test( str, regExp.regex, targetOpt.targetPos, true ) ) {
            str = str.substr(0, targetOpt.targetPos) + regExp.newText + str.substr(targetOpt.targetPos + targetOpt.needle.length );
        }
        else {
            var res = XRegExp.replace( str, regExp.regex, function(match,index) {
                //console.log("ReplaceTEx->", index, " ", targetOpt.targetPos);
                if( index == targetOpt.targetPos ) {
                    return regExp.newText;
                }
                return match;
            });
        }
        return str;
    });
}



/* Markup a single file by plaing only feedback Items from a specific tool into the file */
function markupFile( file, selectedTool, feedbackItems )
{
    var content = file.content;
    var offset = 0;

    var nextItem = null;
    var idArr = [];
    var matchClasses = "";

    var fileParser = new FileParser();
    fileParser.setupContent( file.content );
    fileParser.tokenize();


    for( var i = 0; i < feedbackItems.length; i++ )
    {  
         var feedbackItem = feedbackItems[i];

        //console.log("Trying ", feedbackItem.target, " at Pos c=", feedbackItem.charPos, " w=", feedbackItem.wordNum, " l=", feedbackItem.lineNum );
        // Check for a specific tool and specific filename or all
        if(  file.originalname == feedbackItems[i].filename  && ( selectedTool == "All" || selectedTool == feedbackItems[i].toolName ) )
        {
            if( !fileParser.hasCh( feedbackItem) ) {
                // Most have line number and character position.
                feedbackItem.charNum = fileParser.getCharNumFromLineNumCharPos( feedbackItem );
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
                content = replaceText( content, {'needle':feedbackItem.target, 'newText':str, 'flags':"gm", 'targetPos': feedbackItem.charNum+offset } );

                offset += (str.length  - newStr.mid.length + 1 );

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

