var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require('fs');
var fbHighlighter = require('./feedbackHighlighter');
var buttonMaker = require('./createTextButton');
var _ = require('lodash');

module.exports = function( app ) {

/*    app.get("/feedbackWaiting", function(req,res,next){
        res.render( viewPath + "feedbackWaiting", { title: 'Feedback page', message:'ok'})
        
    });
*/
    /* Markup a single file by plaing only feedback Items from a specific tool into the file */
    function markupFile( file, selectedTool, feedbackItems )
    {
        var content = file.content;
        var offset = 0;
        var nextItem = null;
        var matchingFeedbackItems= 1;
        var idArr = [];
        var matchClasses = "";
        var errorType =  "", originalErrorType = "";

        for( var i = 0; i < feedbackItems.length; i++ )
        {
            // Check for a specific tool and specific filename or all
            if(  file.filename == feedbackItems[i].filename  && ( selectedTool == "All" || selectedTool == feedbackItems[i].toolName ) )
            {
                // Find the closest positional match for the error.
                var feedbackItem = feedbackItems[i];
                var closest = fbHighlighter.findClosestMatch(content, {'needle':feedbackItem.target, 'flags':"gm", 'targetPos':  feedbackItem.wordNum+offset } );
                var closestPos = closest ? closest.index : feedbackItem.wordNum;

                nextItem = (i+1<feedbackItems.length) ? feedbackItems[i+1] : null;
                var nextMatches =  nextItem && (nextItem.target == feedbackItem.target && nextItem.wordNum ==  feedbackItem.wordNum );

                idArr.push(i);
                if( nextItem && nextMatches ) {
                    // We have multiple errors on this word.
                    matchClasses = " multiError";
                }

                if(nextMatches) 
                {
                    // Next Item will be  a match in terms of target word and word Number 
                    matchingFeedbackItems++; // Keep track of how many matches occurred.
                }
                else 
                {
                    // Assign either the multiError or the specific error type.
                    // Also an array for the feedback Items array that match this error
                    matchClasses =   matchClasses == "" ? feedbackItems[i].type : matchClasses;
                    var options = { 'classes': matchClasses, 'data': idArr };

                    // Create a popover button at position to highlight text and count the offset.
                    var newStr = buttonMaker.createTextButton(feedbackItem, options);
                    var str = newStr.start + newStr.mid + newStr.end;       
                    content = fbHighlighter.replaceText( content, {'needle':feedbackItem.target, 'newText':str, 'flags':"gm", 'targetPos': closestPos } );
                    offset += str.length ;

                    // Reset data
                    matchingFeedbackItems=1;
                    matchClasses = "";
                    idArr = [];
                }
            }
        }
        return content;
    }    

    function readFeedbackFormat( data , options)
    {
        var feedbackFormat = JSON.parse(data);

        var files = feedbackFormat.files; // Array of files
        var feedbackItems = feedbackFormat.feedback;

        // A Unique list of tools used for UI
        var toolsUsed = _.uniqBy(feedbackItems,'toolName');

        // Sorter order here is important, we want the earliest words to come first
        var sortedFeedbackItems = _.sortBy( feedbackItems, ['filename','wordNum','toolName']);

        // Tool should always be selected unless it's defaulted too.
        var selectedTool = (options && options['tool'] || toolsUsed[0].toolName);

        // For each file, read in the content and mark it up for display.
        for( var i = 0; i < files.length; i++ )
        {
            var file = files[i];
            file.content = fs.readFileSync( file.contentFile, 'utf-8');
            file.markedUp = markupFile( file, selectedTool, sortedFeedbackItems );
        }
        return {'files':files, 'feedbackItems': sortedFeedbackItems, 'toolsUsed':toolsUsed, 'selectedTool':selectedTool };
    }

    function readFiles( filename , options) {
        
        var supportedToolsFile = filename;
        var data = fs.readFileSync( supportedToolsFile, 'utf-8');
        return readFeedbackFormat( data, options );
    }

    app.get('/feedbackTest/data', function( req,res, next ){
        
        var supportedToolsFile = './tests/testFiles/exampleFeedback2.json';
        fs.readFile( supportedToolsFile, 'utf-8'    , function( err, data ) {
            if( err ) {
                //Unable to get support tools file, larger problem here.
                console.log(err);
            }
            else {
                //Load JSON tool file and send back to UI to create inputs
                var result = readFeedbackFormat( data );
                res.json( result );
            }
        });
    });

    app.post('/feedbackTest/', function(req,res,next){

        // Would really like to reuse the previously send information.
        // Get and Post are the essentially the same until ...I figure out resuse of feedbackObject
        // As this could essecially just be a filter  with the new tool name.
        
        var opt = { 'tool': req.body.toolSelector };
        var page = { title: 'Feedback page' };
        var feedback = readFiles('./tests/testFiles/exampleFeedback2.json', opt);
        var result = _.assign(page,feedback);
        res.render( viewPath + "feedbackTest", result );

    });

    app.get('/feedbackTest', function(req,res, next ){

        var page = { title: 'Feedback page' };
        var feedback = readFiles('./tests/testFiles/exampleFeedback2.json');
        var result = _.assign(page,feedback);
        res.render( viewPath + "feedbackTest", result );
    });
}