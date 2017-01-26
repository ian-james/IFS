var path = require('path');
var viewPath = path.join( __dirname + "/");

var fs = require('fs');

module.exports = function( app ) {

    app.route("/preferences")

    .get( function(req,res,next){
        res.render( viewPath + "preferences", { title: 'Prefernces page', message:'ok'})
    })

    .post(function(req,res,next) {
        //Temporary 
        res.location( "/tool");
        res.redirect( "/tool" );
    });
     
    app.get('/preference/data', function(req,res) {
        var supportedToolsFile = './users/preferencesList.json';
        fs.readFile( supportedToolsFile, 'utf-8', function( err, data ) {
            if( err ) {
                //Unable to get support tools file, larger problem here.
                Logger.error(err);
            }
            else {
                var jsonObj = JSON.parse(data);
                res.json(jsonObj['preferences']);
            }
        });
    });
}

