var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require('fs');
var fbHighlighter = require('./feedbackHighlighter');
var buttonMaker = require('./createTextButton');


module.exports = function( app ) {

/*    app.get("/feedbackWaiting", function(req,res,next){
        
        
        res.render( viewPath + "feedbackWaiting", { title: 'Feedback page', message:'ok'})
        
    });
*/

    // Passing in the json Object
    // 

    function markupFile( file  ) {
      
        var tools = file.tools;
        var feedback = tools[0].feedback;
        var content = file.content;

        // For each piece of feedback received add
        for(var i = 0;i < feedback.length;i++)
        {
            var feedbackItem = feedback[i];
            feedbackItem['file'] = file.filename;
            feedbackItem['tool'] = tools[0].DisplayName;

            var newStr = buttonMaker.createTextButton(feedbackItem);
            var closest = fbHighlighter.findClosestMatch(content, {'needle':feedbackItem.target, 'flags':"gm", 'targetPos': feedbackItem.wordNum } )
            
            var closestPos = closest ? closest.index : feedbackItem.wordNum ;
            content = fbHighlighter.replaceText( content, {'needle':feedbackItem.target, 'newText':newStr, 'flags':"gm", 'targetPos': closestPos } );
        }

        return content;
    }

    function readFiles( filename ) {
        
        var supportedToolsFile = './tests/testFiles/exampleFeedback.json';
        var data = fs.readFileSync( supportedToolsFile, 'utf-8');
            
        var feedbackFilesInfo = JSON.parse(data);
        
        for(var i = 0; i < feedbackFilesInfo.length; i++)
        {
            var file = feedbackFilesInfo[i];
            file.content = fs.readFileSync( file.contentFile, 'utf-8');
            file.markedUp = markupFile( file );
        }
        return feedbackFilesInfo;
    }

    app.get('/feedbackTest/data', function( req,res, next ){
        
        var supportedToolsFile = './tests/testFiles/exampleFeedback.json';
        fs.readFile( supportedToolsFile, 'utf-8'    , function( err, data ) {
            if( err ) {
                //Unable to get support tools file, larger problem here.
                console.log(err);
            }
            else {
                //Load JSON tool file and send back to UI to create inputs
                var jsonObj = JSON.parse(data);

                for(var i = 0; i < jsonObj.length; i++)
                {
                    var file = jsonObj[i];
                    file.content = fs.readFileSync( file.contentFile, 'utf-8');
                    file.markedUp = markupFile( file );
                }

                res.json(jsonObj);
            }
        });
    });

    app.get('/feedbackTest', function(req,res, next ){

        var feedback = readFiles("");
        res.render( viewPath + "feedbackTest", { title: 'Feedback page', feedbackItems:feedback});//, filesArr:files } )
    });
}