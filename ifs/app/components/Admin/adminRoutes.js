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

var adminDB = require(__components + "Admin/adminDB.js");

module.exports = function( app ) {
    /**
     * This functions checks a user's role to identify if they're an admin.
     * Only appplies to pages /admin/*, so the rest of the time you'll be a normal user.
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    function requiresAdmin(req, res, next) {
        if (req && req.user) {
            adminDB.getRole( req.user.id, function (err,roles){
                if (roles && roles.length > 0 && adminDB.isAdmin(roles[0].value)) {
                    next();
                } else {
                    res.sendStatus(400);
                }
            });
        }
        else {
            res.redirect('/login');
        }
    }

    app.all('/admin*', requiresAdmin );

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
     * [addAdminPage description] - Creates basic admin page
     * @param {[Object]} options [Requires adminPage and formAction to operate]
     */
    function addAdminPage(req,res,options) {
        var message = '';
        var error = false;
        if (options.query) {
            if (options.query.err)
                error = true;
            if (options.query.err === 'date') {
                message = "Invalid date format.";
            } else if (options.query.err === 'title') {
                message = "Illegal characters in title, name, or code.";
            } else if (options.query.err === 'desc') {
                message = "Illegal characters in description.";
            } else if (options.query.err === 'a') {
                message = "Invalid assignment.";
            }
        }
        var preferencesFile = options.adminPage;
        fs.readFile(preferencesFile, 'utf-8', function(err, data) {
            if (err) {
                Logger.error(err);
                res.end();
            } else {
                var jsonObj = JSON.parse(data);
                var menuOptions = jsonObj['page'];
                updateJsonWithDbValues(menuOptions.options, options.dynamicData)
                res.render(viewPath + options.adminForm, { title: 'Admin Dashboard', page: menuOptions, formAction: options.formAction, message: message, error: error });
            }
        });
    }

    /**
     * Takes pageOptions in json format and adds dynamic data for a very basic menu type.
     * @param  {[type]} pageOptions [description]
     * @param  {[type]} dynamicData [description]
     * @return {[type]}             [description]
     */
    function updateJsonWithDbValues( pageOptions, dynamicData ) {
        if (dynamicData) {
            for(var i = 0; i < dynamicData.length; i++) {

                var r = _.find(pageOptions,_.matchesProperty('name',dynamicData[i].target));
                if (r) {
                    r['values'] = dynamicData[i].values;
                    r['value'] = dynamicData[i].value;
                }
            }
        }
    }

    function validateTitles(res, route, titles, cb) {
	// Commenting out as settings need allow many blacklisted items 
	cb(false,route);
        /*var error = false
        for (var i = 0; i < titles.length; i++) {
            if (!sanitization.validateText(titles[i], 'title')) {
                error = true;
                break;
            }
        }
        cb(error, route);
	*/
    }

    function validateDesc(res, route, desc, cb) {
	// Commenting out as settings need allow many blacklisted items 
	cb(false,route);
	
	/*
        var error = false
        if (!sanitization.validateText(desc, 'par')) {
            error = true;
        }
        cb(error, route);
	*/
    }

    function validateDates(res, route, dates, cb) {
        var error = false;
        for (var i = 0; i < dates.length; i++) {
            if (!validator.toDate(dates[i])) {
                error = true;
                break;
            }

        }
        cb(error, route);
    }

    /**
     * This function collects a small number of IFS usage stats
     * and presents the admin dashboard.
     */
    app.route('/admin')
    .get(function(req,res) {
        // Total Students
        // Active Students this week
        // Students per Discipline
        // Submission This week
        async.parallel(
            [adminDB.countTotalStudents,
             adminDB.countStudentsOnlineThisWeek,
             adminDB.countStudentPerDisciplineThisWeek,
             adminDB.countWeeklySubmission
            ],
            function(err,results) {
                var stats ={};
                if( results ) {
                    for(var i = 0; i < results.length; i++) {
                        if( results[i] ) {
                            if( results[i].length > 1) {
                                var disciplineType = [];
                                for(var y = 0; y < results[i].length;y++)
                                    disciplineType.push( results[i][y]);
                                _.extend(stats,{'disciplineType': disciplineType});
                            }
                            else
                                _.extend(stats,results[i][0]);
                        }
                    }
                }
                res.render(viewPath + "admin", { title: 'IFS Admin Dashboard', stats: stats });
            }
        );
    });

    /**************************************************************ADMIN Add CLASS**/
    app.route('/admin-add-course')
    .get(function(req, res) {
        addAdminPage(req, res, {
            adminForm: 'adminForm',
            adminPage:'./data/admin/class.json',
            formAction:"/admin-add-course",
            query: req.query
        });
    })
    .post(function(req,res,next) {
        var route = '/admin-add-course'
        var code = req.body['class-code']
        var name = req.body['class-name']
        var desc = req.body['class-description']

        validateTitles(res, route, [code, name], function(err, route) {
           if (err) { 
                directTo(res, url.format({
                    pathname: route,
                    query: {
                        err: 'title'
                    }
                }));
            } else {
                validateDesc(res, route, desc, function(err2, route) {
                    if (err2) {
                        directTo(res, url.format({
                            pathname: route,
                            query: {
                                err: 'desc'
                            }
                        }));
                    } else {
                        var courseKeys = ["class-code","class-name","class-description","class-disciplineType"];

                        var submission = _.pick(req.body, courseKeys);
                        var values = _.values(submission);

                        adminDB.insertCourse(values, function(err,result){
                            directTo(res);
                        });
                    }
                });
            }
        });

    });

    /*************************************************************ADMIN Add Event**/
    app.route('/admin-add-event')
    .get(function(req,res) {
        adminDB.getAllClasses( function(err,data) {
            var result = _.map( data, obj => obj['code']);
            addAdminPage(req, res, {
                adminForm: 'adminForm',
                adminPage:'./data/admin/upcomingEvent.json',
                formAction:"/admin-add-event",
                query: req.query,
                dynamicData: [{
                    "target":"class-name",
                    "values": result,
                    "value": ""
                }]
            });
        });
    })
    .post(function(req,res,next) {
        var route = '/admin-add-event';
        var error = false;
        var name = req.body['event-name']
        var title = req.body['event-title']
        var desc = req.body['event-description']

        validateTitles(res, route, [title, name], function(err, route) {
            if (err) {
                directTo(res, url.format({
                    pathname: route,
                    query: {
                        err: 'title'
                    }
                }));
            } else {
                validateDesc(res, route, desc, function(err2, route) {
                    if (err2) {
                        directTo(res, url.format({
                            pathname: route,
                            query: {
                                err: 'desc'
                            }
                        }));
                    } else {
                        validateDates(res, route, [req.body['event-startDate'], req.body['event-endDate']], function(err3, route) {
                            if (err3) {
                                directTo(res, url.format({
                                    pathname: route,
                                    query: {
                                        err: 'date'
                                    }
                                }));
                            } else {
                                var keys = ["event-name","event-title","event-description","event-startDate","event-endDate"];
                                var submission = _.pick(req.body, keys);
                                // Find the class id then insert event for class
                                adminDB.getClassByCode(req.body['class-name'], function(err,data) {

                                    var values = _.values(submission);
                                    values.unshift(data[0].id);

                                    adminDB.insertUpcomingEvent(values, function(err,result) {
                                        directTo(res);
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    /**************************************************************ADMIN Add Assignment**/
    app.route('/admin-add-assignment')
    .get(function(req,res) {
        adminDB.getAllClasses(function(err,data) {
            var result = _.map(data, obj => obj['code']);
            addAdminPage(req, res, {
                adminForm: 'adminForm',
                adminPage:'./data/admin/assignment.json',
                formAction:"/admin-add-assignment",
                query: req.query,
                dynamicData: [{
                    "target":"class-name",
                    "values": result,
                    "value": ""
                }]
            });
        });
    })
    .post(function(req,res,next) {
        var error = false;
        route = '/admin-add-assignment';
        var name = req.body['assignment-name'];
        var title = req.body['assignment-title'];
        var desc= req.body['assignment-description'];
        var date= req.body['assignment-dueDate'];

        validateTitles(res, route, [name, title], function(err, route) {
            if (err) {
                directTo(res, url.format({
                    pathname: route,
                    query: {
                        err: 'title'
                    }
                }));
            } else {
                validateDesc(res, route, desc, function(err2, route) {
                    if (err2) {
                        directTo(res, url.format({
                            pathname: route,
                            query: {
                                err: 'desc'
                            }
                        }));
                    } else {
                        validateDates(res, route, [date], function(err3, route) {
                            if (err3) {
                                directTo(res, url.format({
                                    pathname: route,
                                    query: {
                                        err: 'date'
                                    }
                                }));
                            } else {
                                var keys = ["assignment-name","assignment-title","assignment-description",
                                            "assignment-dueDate"];

                                var submission = _.pick(req.body, keys);

                                // Find the class id then insert event for class
                                adminDB.getClassByCode(req.body['class-name'], function(err,data) {
                                    var values = _.values(submission);
                                    values.unshift(data[0].id);

                                    adminDB.insertAssignment(values, function(err,result) {
                                        directTo(res);
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    });

      /******************************************************************ADMIN Add Assignment Task**/
    app.route('/admin-add-assignment-task')
    .get(function(req,res) {
        adminDB.getAllClasses(function(err,classes) {
            var result = _.map(classes, obj => obj['code']);
            adminDB.getAllAssignments(function(err,assignments) {
                var assignmentNames = _.map(assignments, obj => obj['name']);
                assignmentNames.unshift(null);
                addAdminPage(req, res, {
                    adminForm: 'adminForm',
                    adminPage:'./data/admin/assignment_task.json',
                    formAction:"/admin-add-assignment-task",
                    query: req.query,
                    dynamicData: [{
                        "target":"class-name",
                        "values": result,
                        "value": ""
                    },{
                        "target":"assignment-name",
                        "values": assignmentNames,
                        "value": ""
                    }]
                });
            });
        });
    })
    .post(function(req,res,next) {
        var route = '/admin-add-assignment-task';
        var error = false;
        var name = req.body['assignment-task-name'];
        var desc = req.body['assignment-task-description'];
        var assign = req.body['assignment-name'];
        if (!assign) {
            error = true;
            res.redirect(url.format({
                pathname: route,
                query: {
                    err: "a"
                }
            }));
        } else {
            validateTitles(res, route, [name], function(err, route) {
                if (err) {
                    directTo(res, url.format({
                        pathname: route,
                        query: {
                            err: 'title'
                        }
                    }));
                } else {
                    validateDesc(res, route, desc, function(err2, route) {
                        if (err2) {
                            directTo(res, url.format({
                                pathname: route,
                                query: {
                                    err: 'desc'
                                }
                            }));
                        } else {
                            var keys = ['assignment-task-name','assignment-task-description'];

                            var submission = _.pick(req.body, keys);
                            var assignmentName = req.body['assignment-name'] == 'null' ? null : req.body['assignment-name'];
                            // Find the class id then insert event for class
                            adminDB.getAssignmentByClassCodeAndName(req.body['class-name'], assignmentName, function(err,data){
                                if(data && data.length > 0) {
                                    var values = _.values(submission);
                                    values.unshift(data[0].aId);

                                    adminDB.insertTask(values, function(err,result) {
                                        directTo(res);
                                    });
                                } else {
                                    req.flash('errorMessage', 'Unable to add task, please check assignment belongs to class.');
                                    res.end();
                                }
                            });
                        }
                    });
                }
            });
        }
    });

     /******************************************************************ADMIN Add Skill**/
    app.route('/admin-add-skill')
    .get(function(req,res) {
        adminDB.getAllClasses(function(err,classes) {
            var result = _.map(classes, obj => obj['code']);
            adminDB.getAllAssignments( function(err,assignments) {
                var assignmentNames = _.map(assignments, obj => obj['name']);
                assignmentNames.unshift(null);
                addAdminPage(req, res, {
                    adminForm: 'adminForm',
                    adminPage:'./data/admin/class_skill.json',
                    formAction:"/admin-add-skill",
                    query: req.query,
                    dynamicData: [{
                        "target":"class-name",
                        "values": result,
                        "value": ""
                    },{
                        "target":"assignment-name",
                        "values": assignmentNames,
                        "value": ""
                    }]
                });
            });
        });
    })
    .post(function(req,res,next) {
        var route = '/admin-add-skill';
        var error = false;
        var name = req.body['skill-name'];
        var desc = req.body['skill-description'];
        var assign = req.body['assignment-name'];
	// Removed incorrect logic assignments can be NULL
            validateTitles(res, route, [name], function(err, route) {
                if (err) {
                    directTo(res, url.format({
                        pathname: route,
                        query: {
                            err: 'title'
                        }
                    }));
                } else {
                    validateDesc(res, route, desc, function(err2, route) {
                        if (err2) {
                            directTo(res, url.format({
                                pathname: route,
                                query: {
                                    err: 'desc'
                                }
                            }));
                        } else {
                            var keys = ['skill-name','skill-description'];
                            var submission = _.pick(req.body, keys);
                            var assignmentName = assign == 'null' ? "" : assign;
                            // Find the class id then insert event for class
                            adminDB.getAssignmentByClassCodeAndName(req.body['class-name'], assignmentName, function(err,data){
                                if(data && data.length > 0) {
                                    var values = _.values(submission);
                                    values.unshift(data[0].aId);
                                    values.unshift(data[0].classId);

                                    console.log("VALUES ", values );

                                    adminDB.insertSkill(values, function(err,result) {
                                        directTo(res);
                                    });
                                } else {
                                    req.flash('errorMessage', 'Unable to add skill, please check assignment belongs to class.');
                                    res.end();
                                }
                            });
                        }
                    });
                }
            });
    });
};
