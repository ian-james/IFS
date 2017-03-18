var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require('fs');
var _ = require('lodash');

module.exports = function( app ) {

    app.get('/', function(req,res, next ){
        res.render( viewPath + "test", { "title":"hellow" });
    });
};