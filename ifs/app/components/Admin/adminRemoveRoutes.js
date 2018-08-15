var router = require('express').Router();
var path = require('path');
var _ = require('lodash');
var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");
var fs = require('fs');

var adminDB = require(__components + "Admin/adminDB.js");

module.exports = function( app ) {
    /**
     * Simple redirect to set as admin page finalizes.
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    function directTo(res, path) {
        if(!path)
            path = "/admin";

        res.location(path);
        res.redirect(path);
    }

    /**
     * Creates the get admin pages 
     * @param  {[type]}   req      Request obj
     * @param  {[type]}   res      Response Obj
     * @param  {[type]}   options  Page options
     * @param  {Function} callback Database callback(currently no options)
     * @return {[type]}            [description]
     */
    function getAdminRemove(req, res, options, callback) {
        var currentUser = _.get(req, "session.passport.user",req.user);
        callback(function(err, data) {
            res.render(viewPath + options.removeForm, {
                title: options.title,
                page: {
                    displayName:options.displayName
                },
                values: data,
                formAction: options.formAction,
                user: currentUser
            });
        });
    }

    /**
     * Create the post admin remove pages. Works for adminRemoveForm
     * @param  {[type]}   req      [description]
     * @param  {[type]}   res      [description]
     * @param  {[type]}   options  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function postAdminRemove(req, res, options, callback) {
        var controlValues = req.body['adminControl'];
        controlValues = _.each(controlValues, x => parseInt(x) );
        
        callback(controlValues, function(err,data) {
            if(err) {
                req.flash('errorMessage', "Unable to remove " + options.removeType + " data is still linked to other student information");
                directTo(res, "/admin-remove-" + options.removeType);
            } else {
                directTo(res);
            }
        });
    }

    /********************************** Remove Classes ******************************/

    app.route('/admin-remove-course')
    .get(function(req, res) {
        getAdminRemove(req, res, {
                removeForm: 'adminRemoveForm',
                title: 'Admin Page',
                displayName:"Remove Course",
                formAction: "/admin-remove-course"
            },
            adminDB.getAllClasses
        );
    })
    .post(function(req, res) {
        postAdminRemove(req,res, {
                removeType: "course"
            },
            adminDB.deleteCourses
        );
    });

    /********************************** Remove Events ******************************/
    app.route('/admin-remove-event')
    .get(function(req, res) {
        getAdminRemove(req, res, {
                removeForm: 'adminRemoveForm',
                title: 'Admin Page',
                displayName:"Remove Event",
                formAction: "/admin-remove-event"
            },
            adminDB.getAllEvents
        );
    })
    .post(function(req, res) {
        postAdminRemove(req, res, {
                removeType: "event"
            },
            adminDB.deleteEvents
        );
    });

    /********************************** Remove Skill ******************************/
    app.route('/admin-remove-skill')
    .get(function(req, res) {
        getAdminRemove(req, res, {
                removeForm: 'adminRemoveForm',
                title: 'Admin Page',
                displayName:"Remove Skill",
                formAction: "/admin-remove-skill"
            },
            adminDB.getAllSkills
        );
    })
    .post(function(req, res) {
        postAdminRemove(req, res, {
                removeType: "skill"
            },
            adminDB.deleteSkills
        );
    });

    /********************************** Remove Assignments ******************************/
    app.route('/admin-remove-assignment')
    .get(function(req,res){
        getAdminRemove(req,res, {
                removeForm: 'adminRemoveForm',
                title: 'Admin Page',
                displayName:"Remove Assignments",
                formAction: "/admin-remove-assignment"
            },
            adminDB.getAllAssignments
        );
    })
    .post(function(req,res){
        postAdminRemove(req,res, {
                removeType: "assignment"
            },
            adminDB.deleteAssignments
        );
    });

      /********************************** Assignment Task ******************************/
    app.route('/admin-remove-assignment-task')
    .get(function(req, res) {
        getAdminRemove(req, res, {
                removeForm: 'adminRemoveForm',
                title: 'Admin Page',
                displayName:"Remove Task",
                formAction: '/admin-remove-assignment-task'
            },
            adminDB.getAllTasks
        );
    })
    .post(function(req, res) {
        postAdminRemove(req, res, {
                removeType: "skill"
            },
            adminDB.deleteTasks
        );
    });
};
