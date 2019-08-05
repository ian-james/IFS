var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");

var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");

var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var eventDB = require(__components + "InteractionEvents/event.js" );
var dbHelpers = require(__components + "Databases/dbHelpers");
var usageQueries = require(__components + "InteractionEvents/usageQueries.js");

var async = require('async');
var _ = require('lodash');


module.exports = function (app, iosocket ) {

    app.get( '/trackedEvent', function(req,res){
        res.render( viewPath + "trackedEvents", {title:"Tracked Events Logger"});
    });

    app.get('/myTrackedEvents', function(req,res){

        eventDB.getUserEvents(req.user.id, function(err,data) {
            res.render( viewPath + "myTrackedEvents", {title:"My Events", events:data});
        });
    });

    app.get('/dashboard', function( req, res , next ) {
    });

    app.get('/studentProfile', function(req,res) {
        res.render( viewPath + "studentProfile", {title:"Tracked Events Logger"});
    });


    function handleQueries( queries, callback ) {

        async.map(queries, function( query, _callback ) {

            db.query( query.request, query.data, function(err,data){
                if(err)
                    _callback("\nErrored on query:" +  query.request, null);
                else {
                    _callback(null,{ "name": query.name, "result": data } );
                }
            });

        }, function(err, results){
            if(err)
                callback({});
            else {

                var usageSummary = {};

                for( var i = 0; i < results.length; i++ ){
                    var o = results[i];
                    usageSummary[ results[i].name ] = eventDB.returnData(results[i].result[0]);
                }
                callback(usageSummary);
            }
        });
    }

    app.get('/userUsage', function(req,res) {
        handleQueries(usageQueries.getAllQueries(req), function(usageSummary){
            res.render( viewPath + "userUsage", {title:"All Session Data", data:usageSummary});
        });
    });

    app.get('/userUsageSession', function(req,res) {
        handleQueries(usageQueries.getSessionQueries(req), function(usageSummary){
            res.render( viewPath + "userUsageSection", {title:"Session Data", data:usageSummary});
        });
    });


    app.get('/userUsageNavigation', function(req,res) {
        handleQueries(usageQueries.getNavigationQueries(req), function(usageSummary){
            res.render( viewPath + "userUsageSection", {title:"Session Data", data:usageSummary});
        });
    });

    app.get('/userUsageSubmission', function(req,res) {
        handleQueries(usageQueries.getSubmissionQueries(req), function(usageSummary){
            res.render( viewPath + "userUsageSection", {title:"Submission Data", data:usageSummary});
        });
    });

    app.get('/userUsagePreferences', function(req,res) {
        handleQueries(usageQueries.getPreferenceQueries(req), function(usageSummary){
            res.render( viewPath + "userUsageSection", {title:"PReferences Data", data:usageSummary});
        });
    });

    app.get('/userUsageFeedback', function(req,res) {
        handleQueries(usageQueries.getFeedbackQueries(req), function(usageSummary){
            res.render( viewPath + "userUsageSection", {title:"Feedback Data", data:usageSummary});
        });
    });

    app.get('/userUsageFeedbackInteraction', function(req,res) {
        handleQueries(usageQueries.getFeedbackInteractionQueries(req), function(usageSummary){
            res.render( viewPath + "userUsageSection", {title:"Feedback Interaction Data", data:usageSummary});
        });
    });

    app.get('/userUsageTool', function(req,res) {
        handleQueries(usageQueries.getToolQueries(req), function(usageSummary){
            res.render( viewPath + "userUsageSection", {title:"Tool Data", data:usageSummary});
        });
    });

    app.get('/userUsageSurvey', function(req,res) {
        handleQueries(usageQueries.getSurveyQueries(req), function(usageSummary){
            res.render( viewPath + "userUsageSection", {title:"Survey Data", data:usageSummary});
        });
    });
}