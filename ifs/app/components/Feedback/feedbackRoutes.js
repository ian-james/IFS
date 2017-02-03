var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require('fs');

module.exports = function( app ) {

/*    app.get("/feedbackWaiting", function(req,res,next){
        
        
        res.render( viewPath + "feedbackWaiting", { title: 'Feedback page', message:'ok'})
        
    });
*/
    app.get('/feedbackTest/data', function( req,res, next ){
        var supportedToolsFile = './tests/exampleFeedback.json';
        fs.readFile( supportedToolsFile, 'utf-8'    , function( err, data ) {
            if( err ) {
                //Unable to get support tools file, larger problem here.
                console.log(err);
            }
            else {
                //Load JSON tool file and send back to UI to create inputs
                var jsonObj = JSON.parse(data);
                console.log("jsonObj", jsonObj);

                for(var i = 0; i < jsonObj.length; i++)
                {
                    var file = jsonObj[i];
                    console.log("**********************");
                    console.log("file:", file);

                    console.log("Read ", file.contentFile);
                    file.content = fs.readFileSync( file.contentFile, 'utf-8');
                }

                res.json(jsonObj);
            }
        });

    });

    app.get('/feedbackTest', function(req,res, next ){
        res.render( viewPath + "feedbackTest", { title: 'Feedback page', message:'ok'})
    });
}