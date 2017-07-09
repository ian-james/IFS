var path = require('path');
var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");

var fs = require('fs');

module.exports = function( app ) {

    app.route("/about")

    .get( function(req,res,next){
        res.render( viewPath + "about", { title: 'About page', message:'ok'})
    });

    app.get('/about/data', function(req,res) {
        var langToolsFile = './tools/toolList.json';
        var progToolsFile = './tools/toolListProgramming.json';

        fs.readFile(langToolsFile, 'utf-8', function(errLang, langToolData) {

            fs.readFile(progToolsFile, 'utf-8', function(errProg, progToolData) {
                if (errLang || errProg ) {
                    // unable to get supported tools file, larger problem here.
                    // Unlikely to occur given these are static files but never know.
                    Logger.error(err);
                    res.json({'lang':[], 'prog':[]});
                } else {
                    var langToolsObj = JSON.parse(langToolData);
                    var progToolsObj = JSON.parse(progToolData);

                    res.json({'lang':langToolsObj, 'prog':progToolsObj})
                }
            });
        });
    })
}

