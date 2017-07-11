var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require('fs');
var _ = require('lodash');

var db = require( __configs + 'database');

module.exports = function (app) {

    app.get('/summary', function( req, res ) {

         var q = "select filename,runType,type,feedback from feedback where userId = ? and runType = ? and toolName = ? and " +
                    "submissionId = (select id from submission where userId = ? ORDER By date DESC Limit 1)";

        db.query(q, [req.user.id,"visual","Text Summary",req.user.id], function(err,data) {
            var msg = "";
            var files = [];
            if(data) {
                var result = {};
                for( var i = 0; i< data.length; i++ ) {
                    var filename = path.basename(data[i].filename);
                    if(!_.has(result,filename))
                        result[filename] = "";
                    result[filename] += data[i].feedback;
                }

                _.forEach( result, function(value,key){
                    files.push({'originalname':key, 'summary': value });
                });
            }
            else
                msg =  "Unable to produce a text summary";

            res.render( viewPath + "textSummary", { title: "Text Summary", files:files, msg: msg });
        });
    });
}
