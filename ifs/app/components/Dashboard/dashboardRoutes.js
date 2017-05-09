var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");

var Constants = require( __components + "Constants/programConstants");
var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");

var async = require('async');

module.exports = function (app, iosocket ) {
   
    app.get( '/trackedEvent', function(req,res){
        res.render( viewPath + "trackedEvents", {title:"Tracked Events Logger"});
    });

    app.get('/dashboard', function( req, res , next ) {
    });

    app.get('/studentProfile', function(req,res) {
        res.render( viewPath + "studentProfile", {title:"Tracked Events Logger"});
    });
}