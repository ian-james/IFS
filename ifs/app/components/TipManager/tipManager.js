/*
  Tip Manager - Show tips
 */

var path = require('path');
var viewPath = path.join( __components + "/Tool/");
var fs = require("fs");

var _ = require('lodash');
var async = require('async');
var Logger = require( __configs + "loggingConfig");


var mysql = require('mysql');
var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");
var preferencesDB = require( __components + 'Preferences/preferenceDB.js');


module.exports = {

    // Randomly check if we should show a tip.
    getRandomlyShowTip: function() {
        return Math.random() < 0.1;
    },

    /***
        Get and Set TIPS into DB, this only occurs on startup.
    */
    getIFSTips: function( tipIndex, callback ) {
        var q = dbHelpers.buildSelect(dbcfg.ifs_tips_table) + dbHelpers.buildWS("id");
        db.query(q,tipIndex,callback);
    },

     /**
     * Returns an array of student preferences,
     * @param  {[type]}   userId   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */

    getTipCount: function( callback ) {
        var q = dbHelpers.buildSelect(dbcfg.ifs_tips_table, "count(*) as tips");
        db.query(q,[],callback);
    },

    /**
     * This is only used on an IFS setup TIPS route.
     * @param {[type]}   name        [description]
     * @param {[type]}   description [description]
     * @param {Function} callback    [description]
     */
    setIFSTips: function( name, description, callback ) {
        var q = dbHelpers.buildSelect(dbcfg.ifs_tips_table) + dbHelpers.buildValues(["name","description"]);
        db.query(req,tipIndex,callback);
    },
    // ALl tips are stored in a single database these are access but individual preferences
    // are stored in the preferences which indicate which index of tip you're on and
    // how often you see the tip.
    // Option to turn them on or off is also include
    // Need a route to generate tips if needed.

/**
 * [selectTip description]
 * @param  {[type]} req      [description]
 * @param  {[type]} res      [description]
 * @param  {[type]} userId   [description]
 * @param  {[type]} callback is what occurs when no tip is
 * @return {[type]}          [description]
 */
    selectTip: function( req,res, userId, callback ) {

        // toolType = "TIPS"
        // toolName = "tips-index" or "tipsAllowed"

        // Start by checking if tip should randomly be shown.
        /// Check Database if tips are allowed.
        preferencesDB.getStudentPreferencesByToolType(userId, "Option", function(err, preferences) {
            var tipIndex = -1;
            var tipAllowed = false;
            var showTip =  !err && module.exports.getRandomlyShowTip() && preferences != null;
            if(preferences) {
                try {
                    var tipIndexObject =  _.find(preferences, ['toolName','pref-tipsIndex']);
                    var tipAllowedObject =  _.find(preferences, ['toolName','pref-tipsAllowed']);

                    if(tipAllowedObject) {
                        if(tipIndexObject)
                            tipIndex = parseInt( _.get(tipIndexObject,'toolValue', "0") );

                        tipAllowed = _.get(tipAllowedObject,'toolValue',"on") == "on";
                        showTip &= tipAllowed;
                    }
                    else
                        showTip = false;
                }
                catch(e) {
                    callback();
                }
            }
            if( !showTip ) {
                callback();
            }
            else {
                module.exports.getIFSTips(tipIndex, function(err, tip){
                    module.exports.getTipCount( function(err,tipCount) {
                        try {
                            var tipC = parseInt( _.get(tipCount[0],"tips", "1") );
                            tipIndex = (tipIndex %tipC) + 1;

                            if(!tip) {
                                // IN case we failed to get tip default back to first tip.
                                tipIndex = 1;
                            }

                            preferencesDB.setStudentPreferences(userId,"Option", "pref-tipsIndex", "" + tipIndex, function(err, wasSet){
                                var title = tip[0].name;
                                var desc =  tip[0].description;
                                // Increment the preference index
                                res.render( viewPath + "tool",
                                    {  "title": req.session.toolSelect + ' Tools',
                                       "surveyQuestions":[],
                                       "tip": { "title": title, "desc": desc }
                                    }
                                );
                            });
                        }
                        catch(e) {
                            // Default to tool page and survey mode
                            callback();
                        }
                    });
                });

            }
        });
    }
}