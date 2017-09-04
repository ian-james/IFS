var path = require('path');
var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");

var fs = require('fs');
var async = require('async');

module.exports = function( app ) {

    app.route("/about")

    .get( function(req,res,next){
        res.render( viewPath + "about", { title: 'About page', message:'ok'})
    });

    app.get('/about/data', function(req,res) {
        var langToolsFile = './tools/toolList.json';
        var progToolsFile = './tools/toolListProgramming.json';

        async.concatSeries( [langToolsFile, progToolsFile], fs.readFile, function(err,files){
            if(err) {
                Logger.error(err);
                res.json({'lang':[], 'prog':[]});
                res.end();
            }
            else {
                var langToolsObj = JSON.parse(files[0]);
                var progToolsObj = JSON.parse(files[1]);
                res.json({'lang':langToolsObj, 'prog':progToolsObj})
            }
        });
    })
}

