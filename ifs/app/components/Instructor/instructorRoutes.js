var router = require('express').Router();
var path = require('path');
var url = require('url');

var _ = require('lodash');
var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");
var fs = require('fs');
var async = require('async');

var validator = require('validator');
var sanitization = require(__configs + "sanitization");

var instructorDB = require(__components + "Instructor/instructorDB.js");

module.exports = function( app ) {

    /*
        Simple function to make sure that the user is an instructor
    */
    function isInstr(req, res, next) {
        var user = _.get(req, "session.passport.user",req.user);
        if (req && req.user) {
            if (user.instr) {
                next();
            } else {
                res.sendStatus(400);
            }
        }
        else {
            res.redirect('/login');
        }
    }

    app.all('/instructor*', isInstr );

    app.route('/instructor')
    .get(function(req,res) {
        instructorDB.getClasses(req.user.id, function(err, data){
            if (!err && data)
                res.render(viewPath + "instructor", { title: 'Instructor Panel', classes: data});
            else
                res.render(viewPath + "instructor", { title: 'Instructor Panel'});
        });
    });
};