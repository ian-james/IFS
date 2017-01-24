var path = require('path');
var viewPath = path.join( __dirname + "/");

module.exports = function( app ) {

    app.route("/feedbackWaiting")

    .get( function(req,res,next){
        console.log("VP" , viewPath);
        res.render( viewPath + "feedbackWaiting", { title: 'Feedback page', message:'ok'})
    })

}

