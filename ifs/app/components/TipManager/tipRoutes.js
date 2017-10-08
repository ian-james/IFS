var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

var db = require( __configs + 'database');
var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");
var Errors = require(__components + "Errors/errors");
var TipManager = require(__components + "TipManager/tipManager");

module.exports = function (app) {
   
    app.get( '/generateTips', function(req,res) {

        // Array of tips
        /*
        fs.readFile(surveyFile, "utf-8", function(err,fileData){
            var jsonData = JSON.parse(fileData);
            async.each(jsonData, function(item, callback) {

                TipManager.setIFSTips(item['name'], item['description'], callback);
            });

        });
        */
    });

}