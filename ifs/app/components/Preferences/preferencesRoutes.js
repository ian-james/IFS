var path = require('path');
var viewPath = path.join( __dirname + "/");

module.exports = function( app ) {

    app.route("/preferences")

    .get( function(req,res,next){
        console.log("VP" , viewPath);
        res.render( viewPath + "preferences", { title: 'Prefernces page', message:'ok'})
    })

    .post(function(req,res,next) {
        //Temporary 
        console.log("Saving Preferences")
        res.location( "/tool");
        res.redirect( "/tool" );
    })

    .put( function(req,res) {
        console.log("Inside preferences put")
    });
}

