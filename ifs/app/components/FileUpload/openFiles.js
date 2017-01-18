var async = require('async');
var fs = require("fs");

module.exports = function (app) {

    openToolOptionsFiles: function( jsonData ) {

        async.forEachOf( jsonData, function(value,key,callback) {
            fs.readFile()
        })
    };
};