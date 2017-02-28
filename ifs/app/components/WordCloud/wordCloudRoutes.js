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


        var arr = [
                ['Hello',12],
                ['Jello',20],
                ['Mellow',5],
                ['Hell',15],
                ['Help',24],
                ['Held',17],
                ['Hold',17],
                ['Bold',5],
                ['Cold',15],
                ['Mold',10],
                ['Fold',10],
                ['Told',10],
            ];

        if( req.session.feedbackFiles ) {
            // Could read feedback file here or read it directly
            // req.wordsTerm;
        }
        
        var scale = 12;
        var maxWords = 40;
        var normed = normalizeWordArray(arr, maxWords, scale );

        res.render( viewPath + "wordCloud", { "words": normed });
    });
};