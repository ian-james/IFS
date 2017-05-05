var path = require('path');
var viewPath = path.join( __dirname + "/");

var fs = require('fs');

var whatever = function(req,res) {
        var langToolsFile = './tools/toolList.json';
        var progToolsFile = './tools/toolListProgramming.json';
        fsCallback(err, data) {
            if( err ) {
                // unable to get supported tools file, larger problem here.
                Logger.error(err);
            }
            else {
                var jsonObj = JSON.parse(data);
                return jsonObj['tools'];
            }
        };

        langToolsObj = fs.readFile(langToolsFile, 'utf-8', fsCallback);
        console.log(langToolsObj);
}

