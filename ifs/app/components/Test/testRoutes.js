var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require('fs');
var _ = require('lodash');

module.exports = function( app ) {

    app.get('/wcloud', function(req,res, next ){

        var arr = [ 
                    ['foo',12],
                    ['bar', 6],
                    ['hello', 10],
                    ['food',12],
                    ['bart', 6],
                    ['hell', 10],
                    ['foot',9],
                    ['fool', 3],
                    ['foster', 30],
                    ['roster',20],
                    ['rab', 4],
                    ['harbour', 13],
                    ['brat', 3]
                ];
        res.render( viewPath + "test", { "words": arr });
    });
};