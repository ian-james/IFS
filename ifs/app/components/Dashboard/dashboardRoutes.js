var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");

var Constants = require( __components + "Constants/programConstants");
var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");

var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
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

    app.get('/userUsage', function(req,res) {

        console.log("URUI",req.user);
         
        var queries = usageQueries.studentModelQueries(req);

        console.log("**********************************************************************************************************");

        _.forEach(queries, function(q){
            console.log("1)");
            console.log(q);
            console.log("\n");

        });

        console.log("**********************************************************************************************************");

        console.log("\n\n");

        async.map(queries, function( query, callback ) {
            console.log(query.data);

            db.query( query.request, query.data, function(err,data){

                if(err)
                    callback("\nErrored on query:" +  query.request, null);
                else {
                    console.log("Adding Data:", query.name, ":\n", data);
                    callback(null,{ "name": query.name, "result": data } );
                }
            });

        }, function(err, results){
            if(err)
                console.log("Throwing usage error", err);
            else {
                console.log("\n\nLast Callback Results:\n",results);
                console.log("**********************************************************************************************************");
                var usageSummary = {};

                for( var i = 0; i < results.length; i++ ){
                    var o = results[i];
                    console.log( "\n",results[i].name );
                    console.log( results[i].result );
                    usageSummary[ results[i].name ] = eventDB.returnData(results[i].result[0]);
                }

                console.log("JSON stringify answer", JSON.stringify(usageSummary));
                res.render( viewPath + "userUsage", {title:"User Usage", data:usageSummary});
            }
        });
    });

    app.get('/dashboard', function( req, res , next ) {
    });

    app.get('/studentProfile', function(req,res) {
        res.render( viewPath + "studentProfile", {title:"Tracked Events Logger"});
    });
}