var path = require('path');
var viewPath = path.join( __dirname + "/");

var fs = require('fs');

module.exports = function( app ) {

    app.route("/about")

    .get( function(req,res,next){
        res.render( viewPath + "about", { title: 'About page', message:'ok'})
    })

    // this is not working
    app.get('/about', function(req,res) {
        var langToolsFile = './tools/toolList.json';
        var progToolsFile = './tools/toolListProgramming.json';
        fs.readFile(langToolsFile, 'utf-8', function(err, data) {
            if (err) {
                // unable to get supported tools file, larger problem here.
                console.log(err);
            } else {
                var langToolsObj = JSON.parse(data);
            }
        });
        fs.readFile(progToolsFile, 'utf-8', function(err, data) {
            if (err) {
                // unable to get supported tools file, larger problem here.
                console.log(err);
            } else {
                var progToolsObj = JSON.parse(data);
            }

        });

        console.log('where does this log to??');
        res.json({'lang':langToolsObj, 'prog':progToolsObj})
    })
}

