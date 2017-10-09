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

    /**
     * Reset Tips
     * Note: Not much error checking going on in this function it basically either fails
     * at startup and we should fix it before deploy or it works.
     *
     * This function delete the ifs_tips table, resets the auto increment counter to 1
     * so the range is always 1 to N and then adds all the questions.
     * @return {[type]} [description]
     */
    function resetTips()
    {
        var tipsFile = 'data/tips/ifsTips.json';
        fs.readFile(tipsFile, "utf-8", function(err,fileData){
            if(!err )
            {
                var jsonData = JSON.parse(fileData);
                TipManager.deleteIFSTips( function() {
                    TipManager.resetIFSTipCounter( function() {
                        async.each(jsonData, function(item, callback) {
                            TipManager.setIFSTips(item['name'], item['description'], function(e,d){
                            });
                        });
                    });
                });
            }
            else {
                Logger.error("Error: Unable to load tips file.");
            }
        });
    }

    // Calling the function during the initial route setup.
    resetTips();

   /**
    * Helper function to generate tips at runtime if needed could be removed for production.
    * @param  {[type]} req  [description]
    * @param  {[type]} res) {                   resetTips();        res.end();    } [description]
    * @return {[type]}      [description]
    */
    app.get( '/generateTips', function(req,res) {
        resetTips();
        res.end();
    });
}