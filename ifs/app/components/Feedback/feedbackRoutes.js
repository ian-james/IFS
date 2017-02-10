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

    function readFeedbackFormat( data )
    {
        var feedbackFormat = JSON.parse(data);

        var files = feedbackFormat.files; // Array of files
        var feedbackItems = feedbackFormat.feedback;

        for( var i = 0; i < files.length; i++ )
        {
            var file = files[i];
            file.content = fs.readFileSync( file.contentFile, 'utf-8');

            // Find feedback items that match this page.
            console.log("Filename", file.filename);
            var perPageFeedback = _.filter(feedbackItems, p => p.filename == file.filename );
            var sortedPerPage = _.orderBy(perPageFeedback,'wordNum');
            console.log("perPage", sortedPerPage);
            file.markedUp = markupFile( file, perPageFeedback );
        }
        return files;
    }

    function readFiles( filename ) {
        
        var supportedToolsFile = filename;
        var data = fs.readFileSync( supportedToolsFile, 'utf-8');
        return readFeedbackFormat( data );
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
                res.json(result);
            }
        });
    });

    app.get('/feedbackTest', function(req,res, next ){

        var feedback = readFiles('./tests/testFiles/exampleFeedback2.json');
        res.render( viewPath + "feedbackTest", { title: 'Feedback page', files:feedback});//, filesArr:files } )
    });
}