var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require('fs');
var _ = require('lodash');

var db = require( __configs + 'database');

module.exports = function( app ) {

    function normalizeWordArray( words, maxWords, scale )
    {
        // Assuming Sorted
        var sum = 0;
        for( var i = 0; i < words.length; i++ ) {
            sum += words[i][1];
        }

        var res = [ ];
        for( var i = 0; i < words.length && i < maxWords ; i++ ) {
            var term = [ words[i][0], Math.ceil(words[i][1]/sum * scale) ];
            res.push(term);
        }
        return res;
    }


    app.get('/cloud', function(req, res ){

        // Only query required for wordCloud so just leaving it here.
        var q = "select feedback,charPos from feedback where userId = ? and runType = ? and type = ? and " +
                    "submissionId = (select id from submission where userId = ? ORDER By date DESC Limit 1)";

        db.query(q, [req.user.id,"visual","wordCloud",req.user.id], function(err,data) {
            
            var msg = "";
            var files = [];
            if( data ) 
            {
                var arr = [];
                
                var result = {};
                for( var i = 0; i< data.length; i++ ) {
                    var subarr = [ data[i].feedback, data[i].charPos ];
                    arr.push(subarr);
                }
            }
            else
                msg =  "Unable to produce a text summary";

            var scale = 12;
            var maxWords = 40;
            var normed = normalizeWordArray(arr, maxWords, scale );

            res.render( viewPath + "wordCloud", { "words": normed, "msg": msg });
        });
    });
}