var router = require('express').Router();
var path = require('path');
var _ = require('lodash');
var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");
var fs = require('fs');

var async = require('async');

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
        if( req && req.user) {
            adminDB.getRole( req.user.id, function (err,roles){
                if( roles && roles.length > 0 && adminDB.isAdmin(roles[0].value)) {
                    next();
                }
                else {
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
        if( !path )
            path = "/adminDashboard";

        res.location( path );
        res.redirect( path );
    }

    /**
     * [addAdminPage description] - Creates basic admin page
     * @param {[Object]} options [Requires adminPage and formAction to operate]
     */
    function addAdminPage(req,res,options){
        var preferencesFile = options.adminPage;
        fs.readFile( preferencesFile, 'utf-8', function( err, data ) {
            if( err ) {
                Logger.error(err);
                res.end();
            }
            else {
                var jsonObj = JSON.parse(data);
                var menuOptions = jsonObj['page'];
                updateJsonWithDbValues(menuOptions.options, options.dynamicData)
                res.render(viewPath + options.adminForm, { title: 'Admin Page', page: menuOptions, formAction: options.formAction });
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
        if(dynamicData) {
            for( var i = 0; i < dynamicData.length; i++ ) {

                var r = _.find(pageOptions,_.matchesProperty('name',dynamicData[i].target));
                if( r )
                {
                    console.log("FOUND r->",r);
                    r['values'] = dynamicData[i].values;
                    r['value'] = dynamicData[i].value;
                }
            }
        }
    }

    /**
     * This function collects a small number of IFS usage stats
     * and presents the admin dashboard.
     */
    app.route('/adminDashboard')
    .get( function(req,res) {
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
                for(var i = 0; i < results.length; i++ ) {

                    console.log("Results ", i, " len ", results[i].length, " values= ", results[i]);

                    if( results[i].length > 1 ) {
                        
                        var disciplineType = [];
                        for(var y = 0; y < results[i].length;y++ )
                            disciplineType.push( results[i][y]);
                        _.extend(stats,{'disciplineType': disciplineType} );
                    }
                    else
                        _.extend(stats,results[i][0]);
                }
                console.log("ROUTES RESULTS", stats);
                res.render(viewPath + "adminDashboard", { title: 'Welcome to IFS', stats: stats });
            }
        );
    });

    /**************************************************************ADMIN Add CLASS**/
    app.route('/adminAddCourse')
    .get(function(req,res) {
        addAdminPage( req,res,{
            adminForm: 'adminForm',
            adminPage:'./data/admin/class.json',
            formAction:"/adminAddCourse"
        });
    })
    .post( function(req,res,next ){
        console.log(req.body);
        var courseKeys = ["class-name","class-code","class-description","class-disciplineType"];

        var submission = _.pick(req.body,  courseKeys);
        var values = _.values(submission);

        adminDB.insertCourse( values, function(err,result ){
            directTo(res);
        });
    });

    /*************************************************************ADMIN Add Event**/
    app.route('/adminAddEvent')
    .get(function(req,res){
        adminDB.getAllClasses( function(err,data) {
            var result = _.map( data, obj => obj['code']);
            addAdminPage( req,res,{
                adminForm: 'adminForm',
                adminPage:'./data/admin/upcomingEvent.json',
                formAction:"/adminAddEvent",
                dynamicData: [{
                    "target":"class-name",
                    "values": result,
                    "value": ""
                }]
            });
        });
    })
    .post( function(req,res,next ){
        var keys = ["event-name","event-title","event-description","event-startDate","event-endDate"];

        var submission = _.pick(req.body, keys);
        console.log("Submission is ", submission);
        // Find the class id then insert event for class
        adminDB.getClassByCode(req.body['class-name'], function(err,data){

            var values = _.values(submission);
            values.unshift(data[0].id);
            console.log(values);

            adminDB.insertUpcomingEvent( values, function(err,result ){
                directTo(res);
            });
        });
    });

     /**************************************************************ADMIN Add Assignment**/
    app.route('/adminAddAssignment')
    .get(function(req,res){
        adminDB.getAllClasses( function(err,data) {
            var result = _.map( data, obj => obj['code']);
            addAdminPage( req,res,{
                adminForm: 'adminForm',
                adminPage:'./data/admin/assignment.json',
                formAction:"/adminAddAssignment",
                dynamicData: [{
                    "target":"class-name",
                    "values": result,
                    "value": ""
                }]
            });
        });
    })
    .post( function(req,res,next ){
        var keys = ["assignment-name","assignment-title","assignment-description",
                    "assignment-dueDate"];

        var submission = _.pick(req.body, keys);
        console.log("Submission is ", submission);
        // Find the class id then insert event for class
        adminDB.getClassByCode(req.body['class-name'], function(err,data){

            var values = _.values(submission);
            values.unshift(data[0].id);
            console.log(values);

            adminDB.insertAssignment( values, function(err,result ){
                directTo(res);
            });
        });
    });

     /******************************************************************ADMIN Add Skill**/
    app.route('/adminAddSkill')
    .get(function(req,res){
        adminDB.getAllClasses( function(err,classes) {
            var result = _.map( classes, obj => obj['code']);
            adminDB.getAllAssignments( function(err,assignments) {

                var assignmentNames = _.map( assignments, obj => obj['name'] );
                assignmentNames.unshift( null );
                addAdminPage( req,res,{
                    adminForm: 'adminForm',
                    adminPage:'./data/admin/class_skill.json',
                    formAction:"/adminAddSkill",
                    dynamicData: [{
                        "target":"class-name",
                        "values": result,
                        "value": ""
                    },{
                        "target":"assignment-name",
                        "values": assignmentNames,
                        "value": ""
                    }
                    ]
                });
            });
        });
    })
    .post( function(req,res,next ){
        var keys = ['skill-name','skill-description']

        console.log("BODY:", req.body);
        var submission = _.pick(req.body, keys);
        console.log("Submission is ", submission);
        var assignmentName = req.body['assignment-name'] == 'null' ? null : req.body['assignment-name'];
        // Find the class id then insert event for class
        adminDB.getAssignmentByClassCodeAndName(req.body['class-name'], assignmentName, function(err,data){

            console.log("Data", data );
            if( data && data.length > 0 ) {
                var values = _.values(submission);
                values.unshift(data[0].aId);
                values.unshift(data[0].classId);
                console.log("Values", values);
                adminDB.insertSkill( values, function(err,result ){
                    directTo(res);
                });
            }
            else {
                console.log("Error");
                req.flash('errorMessage', 'Unable to add skill, please check assignment belongs to class.');
                res.end();
            }
        });
    });
};