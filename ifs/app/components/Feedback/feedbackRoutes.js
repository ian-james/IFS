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
    function markupFile( file, feedbackItems )
    {
        var content = file.content;

        for( var i = 0; i < feedbackItems.length; i++ )
        {
            var feedbackItem = feedbackItems[i];
            var newStr = buttonMaker.createTextButton(feedbackItem);
            var closest = fbHighlighter.findClosestMatch(content, {'needle':feedbackItem.target, 'flags':"gm", 'targetPos': feedbackItem.wordNum } )
            
            var closestPos = closest ? closest.index : feedbackItem.wordNum ;
            content = fbHighlighter.replaceText( content, {'needle':feedbackItem.target, 'newText':newStr, 'flags':"gm", 'targetPos': closestPos } );
        }
        return content;
    }    

    function readFeedbackFormat( data , options)
    {
        var feedbackFormat = JSON.parse(data);

        var files = feedbackFormat.files; // Array of files
        var feedbackItems = feedbackFormat.feedback;
        var toolsUsed = _.uniqBy(feedbackItems,'toolName');
        

        var selectedTool = (options && options['tool'] || toolsUsed[0].toolName);
        console.log("**********************************************************************************TOOOLS", selectedTool);

        for( var i = 0; i < files.length; i++ )
        {
            var file = files[i];
            file.content = fs.readFileSync( file.contentFile, 'utf-8');

            // Find feedback items that match this page.
            var perPageFeedback = _.filter(feedbackItems, p => p.filename == file.filename );
            // Filter by toolName
            perPageFeedback = _.filter( perPageFeedback, p => p.toolName == selectedTool );
            // Ascending Order
            var sortedPerPage = _.orderBy(perPageFeedback,'wordNum');

            file.markedUp = markupFile( file, perPageFeedback );
        }
        return {'files':files, 'feedbackItems': feedbackItems, 'toolsUsed':toolsUsed, 'selectedTool':selectedTool };
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