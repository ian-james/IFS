var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require('fs');
var _ = require('lodash');

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


    app.get('/cloud', function(req, res, next ){
    
        var arr = [];
        var msg = "";
        if( req.session.allFeedbackFile ) {
            // Could read feedback file here or read it directly
            // req.wordsTerm;
            try {
                var file = req.session.allFeedbackFile;
                var feedback = fs.readFileSync( file , 'utf-8');
                var jdata = JSON.parse( feedback );

                if(jdata && jdata.feedback.visual) {
                    
                    var hasData = false;
                    for( var i= 0; i < jdata.feedback.visual.length; i++ )
                    {
                        if( jdata.feedback.visual[i].type  == "wordCloud" ) {
                         arr = arr.concat( jdata.feedback.visual[i].wordFreq );
                        }
                    }
                }
            }
            catch( e ) {
                // This is handles by pre-filled array.
            }
        }

            // Defaults for fun.
        if( arr.length == 0) {
            arr = [
                    ['Help',12],
                    ['Failure',20],
                    ['What',5],
                    ['Now',15],
                    ['Cloud',24],
                    ['Refresh',17],
                    ['Browser',17],
                    ['Not',5],
                    ['Working',15]
            ];
            msg = "Unable to produce a file cloud for your submission."
        }
        
        var scale = 12;
        var maxWords = 40;
        var normed = normalizeWordArray(arr, maxWords, scale );

        res.render( viewPath + "wordCloud", { "words": normed, "msg": msg });
    });
};