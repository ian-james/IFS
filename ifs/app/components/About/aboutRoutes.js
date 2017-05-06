var path = require('path');
var viewPath = path.join( __dirname + "/");

var fs = require('fs');

module.exports = function( app ) {

    app.route("/about")

    .get( function(req,res,next){
        res.render( viewPath + "about", { title: 'About page', message:'ok'})
    });

    // this is not working
    app.get('/about/data', function(req,res) {
        var langToolsFile = './tools/toolList.json';
        var progToolsFile = './tools/toolListProgramming.json';

        console.log("ACTUALLY CALLING app.get ");

        // Callbacks in Node are slightly differnt that every other language (probalby?!)
        // They aren't good for returning values, they are mostly good for accomplishing something
        //
        // So in English, it's read langToolsFile finished
        // Read progToolsFile
        // When Done
        // Check for an error in either (Note...nothing really handled there)
        // If everything was ok, we should have file data for both.
        // Pase the data and send to Angular controlller
        // res.json actually finishes teh request, i believe.
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

        // This will log before readFile has finished in most cases.
        console.log('This logs to server command window');
        //Logger.info("Could also work here if Logger is included via require");
    })
}

