var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");

var Constants = require( __components + "Constants/programConstants");
var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");

var eventDB = require(__components + "InteractionEvents/event.js" );


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
}