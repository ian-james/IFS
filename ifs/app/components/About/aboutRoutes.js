var path = require('path');
var viewPath = path.join( __dirname + "/");

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
                    console.log(err);

                    // You might want to send empty array here, but about.pug will need to check for empty values then.
                    // Up to you how you handle this.
                    // res.json('lang'[], 'prog':[]})
                } else {
                    var langToolsObj = JSON.parse(langToolData);
                    var progToolsObj = JSON.parse(progToolData);

                    console.log("lang", langToolsObj);
                    console.log("prog", progToolsObj);

                    res.json({'lang':langToolsObj, 'prog':progToolsObj})
                }
            });
        });
    })
}

