var router = require('express').Router();
var path = require('path');
var url = require('url');

var _ = require('lodash');
var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");
var fs = require('fs');
var async = require('async');
var qs = require('querystring');

var validator = require('validator');
var sanitization = require(__configs + "sanitization");

var instructorDB = require(__components + "Instructor/instructorDB.js");

module.exports = function( app ) {

    /**
     * This functions checks a user's role to identify if they're an instructor.
     * Only appplies to pages /instructor/*, so the rest of the time you'll be a normal user.
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    function isInstructor(req, res, next) {
        var user = _.get(req, "session.passport.user",req.user);
        console.log( user );
        if (req && req.user) {
            instructorDB.getRole(req.user.id, function(err, role) {
                if (role.length > 0 && role[0].value == "instructor"){
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

    /**
     * Checks to see if a option is enabled for a certain course.
     * @param  integer   optionId  The option id.
     * @param  array     choices   The choices.
     * @return {[type]}        [description]
     */
    function checkEnabled(optionId, choices){
        for (var i = 0; i < choices.length; i++){
            if(optionId == choices[i].optionId)
                return 1;
        }
        return 0;
    }

    /**
     * Inserts the skills into both skill page and class skill.
     * @param  array   skills  The skills.
     * @param  integer classId The class id.
     * @param  integer assignmentId The assignment id
     * @return {[type]}        [description]
     */
    function skillInsert(skills, classId, assignmentId){
        //TODO: This function management of errors and improvement.
        for(var i = 0; i < skills.length; i++){
            var data = [classId, assignmentId, skills[i]];
            instructorDB.insertSkill(skills[i], function(err) {});
            if( assignmentId == -1 )
                instructorDB.insertClassSkillNoAssignment([classId, skills[i]],function(err){});
            else
                instructorDB.insertClassSkill(data, function(err) {});
        }
    }

    /**
     * Inserts the tasks.
     * @param  array   arr    The array of tasks.
     * @param  assignmentId   The assignment id.
     */
    function taskInsert(arr, assignmentId, resetTasks){
        var taskName = taskDescription = "";
        var count = 0;

        if (resetTasks)
            instructorDB.deleteTasks(assignmentId, function(err){});

        for(var key in arr){
            if(key.indexOf('tName') != -1)
            {
                taskName = arr[key];
                count = 1;
            }
            else if (key.indexOf('tDesc') != -1)
            {
                taskDescription = arr[key];
                count++;
            }
            else{
                count = 0;
            }

            if(count == 2){
                var temp = [assignmentId, taskName, taskDescription];
                instructorDB.taskInsert(temp, function (err) {});
                count = 0;
            }
        }
    }

    /**
     * Parses the skills marking which ones have already been enabled.
     * @param  array   s  The skills.
     * @param  callback  callback   The callback.
     */
    function parseSkills(s, callback){

        instructorDB.getSkills(function (err, results){
            var skills = [];
            if (!err && results){
                for (var i = 0; i < results.length; i++){
                    var skill = {};
                    skill.s = results[i].name;
                    skill.enabled = 0;
                    for (var j = 0; j < s.length; j++){
                        if(results[i].name == s[j].name)
                        {
                            skill.enabled = 1;
                            break;
                        }
                    }
                    skills.push(skill);
                }
            }
            callback(undefined, skills);
        });
    }

    /**
     * Sets up the disciplines, setting which one should be enabled.
     * @param array d The disciplines
     * @return array The disciplines
     */
    function setupDiscipline(d){
        var disciplines = [];
        var dOptions = ["computer science", "psychology", "other"];
        for (var i = 0; i < dOptions.length; i++){
            var discipline = {};
            discipline.name = dOptions[i];
            if (dOptions[i] == d){
                discipline.enabled = 1;
            }
            else {
                discipline.enabled = 0;
            }
            disciplines.push(discipline);
        }
        return disciplines;
    }

    /**
     * Sets up the semesters, setting which one should be enabled.
     * @param array sem  The semesters
     * @return arr The semesters
     */
    function setupSemester(sem){
        var semesters = [];
        var sOptions = ["fall", " winter", "summer"];
        for (var i = 0; i < sOptions.length; i++){
            var semester = {};
            semester.name = sOptions[i];
            if (sOptions[i] == sem){
                semester.enabled = 1;
            }
            else {
                semester.enabled = 0;
            }
            semesters.push(semester);
        }
        return semesters;
    }

    app.all('/instructor*', isInstructor);

    app.route('/instructor')
    .get(function(req,res) {
        var classes = {}, assignments = {}, stats = {}, aoptions={}, coptions={}, tips={}, skills = {}, events = {};

        async.parallel([
            async.apply(instructorDB.getClasses, req.user.id),
            async.apply(instructorDB.getAssignments, req.user.id),
            async.apply(instructorDB.fetchAssignmentOptions, "", true),
            async.apply(instructorDB.fetchClassOptions, "", true),
            instructorDB.getRandomTip,
            instructorDB.getSkills,
            async.apply(instructorDB.getEvents, req.user.id),
            async.apply(instructorDB.countInstStudents, req.user.id),
            async.apply(instructorDB.countInstStudentsOTW, req.user.id),
            async.apply(instructorDB.countWeeklySubmission, req.user.id),

        ],
        function(err, results) {
            if (results){
                for (var i = 0; i < results.length; i++){
                    if(results[i]){
                        switch(i) {
                            case 0:
                                classes = results[i]; // set classes
                                break;
                            case 1:
                                assignments = results[i]; // set assignments
                                break;
                            case 2:
                                aoptions = results[i]; // set assignment options
                                break;
                            case 3:
                                coptions = results[i]; // set class options
                                break;
                            case 4:
                                tips = results[i]; // set tips
                                break;
                            case 5:
                                skills = results[i];
                                break;
                            case 6:
                                events = results[i];
                                break;
                            default:
                                _.extend(stats, results[i][0]); // get statistics
                        }
                    }
                }
            }
            res.render(viewPath + "instructor", { title: 'Instructor Panel', classes: classes, assignments: assignments,
                       stats: stats, aoptions: aoptions, coptions: coptions, tips: tips[0], skills: skills, events: events});
        });

    });

    app.route('/instructor')
    .post(function(req,res,next){
        // parses sequelize
        var data = qs.parse(req.body.formData);
        if (req.body.form == 'createCourse'){ // create course
            console.log("CSkillS", data.cskills)
            if (!Array.isArray(data.cskills)) data.cskills = [data.cskills];
            var arr = [data.ccode, data.cname, data.cdesc, data.ctype,
                       req.user.id, data.cyear, data.csemester];
            instructorDB.insertCourse(arr, function(err, queryInfo){
                if(!err){
                    skillInsert(data.cskills, queryInfo.insertId, -1);
                    res.sendStatus(200);
                }
                else
                    res.status(500).send();
            });
        }
        else if (req.body.form == 'createAssign'){ // create assignment
            if (!Array.isArray(data.askills)) data.askills = [data.askills];
            console.log(data.cnameA);
            var courseInfo = JSON.parse(data.cnameA);
            var arr = [courseInfo.cid, data.aname, data.atitle, data.adesc, data.adate];
            instructorDB.insertAssignment(arr, function(err, queryInfo){
                if(!err){
                    skillInsert(data.askills, courseInfo.cid, queryInfo.insertId);
                    taskInsert(data, queryInfo.insertId, false);
                    res.sendStatus(200);
                }
                else
                    res.status(500).send();
            });
        }
        else if (req.body.form == 'createEvent'){ // create event
            var courseInfo = JSON.parse(data.cnameE);
            var arr = [courseInfo.cid, data.ename, data.etitle, data.edesc, data.estartdate, data.eduedate];
            instructorDB.insertEvent(arr, function(err, queryInfo){
                if(!err){
                    res.sendStatus(200);
                }
                else
                    res.status(500).send();
            });
        }
    });

    /********************************
     ** The manage assignment page  -- sorry this happened **
     ********************************/
    app.route('/instructor-manage-assignment')
    .post(function(req,res,next){
        var id = req.body['assignment-id'];
        instructorDB.checkAssignmentAccess(id, req.user.id, function(err, result){
            // make a check in case it fails and display some other page????
            if(!err && result){
                // lets check to make sure they have permission. prevents against
                // client side scripting
                if(result[0].found == '1') {
                    instructorDB.getAssignment(id, function(err, assignment){ // get the assignment its safer than passing all that data
                        if(!err && assignment){
                            var assign = assignment[0];
                            assign.deadline = assign.deadline.toLocaleDateString();
                            instructorDB.getAssignmentSkills(id, function(err, skills){
                                if(!err && skills){
                                    parseSkills(skills, function(err, s){
                                        if (!err && s) skills = s;
                                    });
                                    instructorDB.getTasks(id, function (err, tasks){
                                        if(!err && tasks){
                                            instructorDB.getAssignmentDiscipline(id, function(err, disResult){
                                                if(!err && disResult){
                                                    instructorDB.fetchAssignmentOptions(disResult[0].discipline, false, function(err, options){
                                                        if (!err && options){
                                                            instructorDB.getAssignmentChoices(id, function(err, choices){
                                                                if (!err && choices){
                                                                    for (var i = 0; i < options.length; i++)
                                                                        options[i].enabled = checkEnabled(options[i].id, choices);
                                                                    res.render(viewPath + "instructorAssignment", {title: 'Assignment management',
                                                                    aid: id, acid: assign.classId, aname: assign.name, atitle: assign.title, adescription: assign.description,
                                                                    adeadline: assign.deadline, aoptions: options, askills: skills, atasks: tasks});
                                                                }
                                                                else{
                                                                    res.sendStatus(400);
                                                                }
                                                            });
                                                        }
                                                        else{ // once again something we need went wrong lets give them an error :p
                                                            res.sendStatus(400);
                                                        }
                                                    });
                                                }
                                                else { // something is wrong lets just give them an error
                                                    res.sendStatus(400);
                                                }
                                            });
                                        }
                                        else {
                                            res.sendStatus(400);
                                        }
                                    });
                                }
                                else {
                                    res.sendStatus(400);
                                }
                            });
                        }
                        else{
                            res.sendStatus(400);
                        }
                    });
                }
                else{ // no permission get them out of here
                    res.sendStatus(400);
                }
            }
            else {
                res.sendStatus(400);
            }
        });


    });

    /***************************************
     **  The instructor manage event page **
     ***************************************/
    app.route('/instructor-manage-event')
    .post(function(req,res,next){
        var id = req.body['event-id'];
        instructorDB.checkEventAccess(id, req.user.id, function(err, result){
            // make a check in case it fails and display some other page????
            if(!err && result){
                if(result[0].found == '1') {
                    instructorDB.getEvent(id, function(err, event){ // get the assignment its safer than passing all that data
                        if(!err && event){
                            var eve = event[0];
                            res.render(viewPath + "instructorEvent", {title: 'Event management',
                            eid: id, ecid: eve.classId, ename: eve.name, etitle: eve.title, edescription: eve.description,
                            eopen: eve.openDate, eclose: eve.closedDate});
                        }
                        else{
                            res.sendStatus(400);
                        }
                    });
                }
                else {
                    res.sendStatus(400);
                }
            }
        });
    });

    /*****************************************
     **  The instructor manage confirm page **
     *****************************************/
    app.route('/instructor-manage-confirm')
    .post(function(req, res, next){
        var data = qs.parse(req.body.formData);
        if (req.body.form == 'updateAssign'){ // update assignment
            if (!Array.isArray(data.askills)) data.askills = [data.askills];
            var arr = [data.aname, data.atitle, data.adesc, data.adate];
            instructorDB.updateAssignment(arr, data.aid, function(err){
                if(!err)
                {
                    taskInsert(data, data.aid, true);
                    instructorDB.deleteAssignmentSkills(data.aid, function(err){
                        if(!err){
                            skillInsert(data.askills, data.acid, data.aid);
                        }
                    });
                    res.sendStatus(200);
                }
                else{
                    res.status(500).send();
                }
            });
        }
        else if(req.body.form == 'updateCourse'){ // update course
            if (!Array.isArray(data.cskills)) data.cskills = [data.cskills];
            var arr = [data.ccode, data.cname, data.cdesc, data.ctype,
                data.cyear, data.csemester];
            instructorDB.updateClass(arr, data.cid, function(err){
                if(!err)
                {
                    instructorDB.deleteClassSkills(data.cid, function(err){
                        if(!err){
                            skillInsert(data.cskills, data.cid, -1);
                            res.sendStatus(200);
                        }
                    });
                }
                else{
                    res.status(500).send();
                }
            });
        }
        else if (req.body.form == 'updateEvent') { // update event
            var arr = [data.ename, data.etitle, data.edesc, data.eopen, data.eclose];
            instructorDB.updateEvent(arr, data.eid, function(err){
                if(!err)
                    res.sendStatus(200);
                else
                    res.status(500).send();
            });
        }
    });

    app.route('/instructor-delete')
    .post(function(req, res, next){
        var data = qs.parse(req.body.formData);
        if (req.body.form == 'deleteAss'){ // delete assignment
            instructorDB.checkAssignmentAccess(data.aid, req.user.id, function(err, result){
                if(!err && result){
                    if(result[0].found == "1"){
                        instructorDB.deleteAssignment(data.aid, req.user.id);
                        res.sendStatus(200);
                    }
                    else{
                        res.status(500).send();
                    }
                }
                else{
                    res.status(500).send();
                }
            });
        }else if (req.body.form == 'deleteEvent'){ // delete event
            instructorDB.checkEventAccess(data.eid, req.user.id, function(err, result){
                if(!err && result){
                    if(result[0].found == "1"){
                        instructorDB.deleteEvent(data.eid);
                        res.sendStatus(200);
                    }
                    else{
                        res.status(500).send();
                    }
                }
                else{
                    res.status(500).send();
                }
            });
        }
    });


    /*********************************
     *** The course dashboard page ***
     *********************************/
    app.route('/instructor-course-dash')
    .post(function(req, res, next){
        var id = req.body['class-id'];
        instructorDB.checkClassAccess(id, req.user.id, function(err, result){
            if(!err && result){
                if(result[0].found == "1"){ // lets fetch the actual class to make sure there was no tampering
                    instructorDB.getClass(id, function(error,course){ // get the class information its safer to just get by id
                        if (!error && course){
                            var cs = course[0];
                            var disciplines = setupDiscipline(cs.disciplineType);
                            var semesters = setupSemester(cs.semester);
                            instructorDB.getClassSkills(id, function(err, skills){
                                parseSkills(skills, function(err, s){
                                    if (!err && s){
                                        res.render(viewPath + "instructorCourse", {title: 'Course management',
                                        cid: id, ccode: cs.code, cname: cs.name, cdescription: cs.description,
                                        cdiscipline: disciplines, cyear: cs.year, csemesters: semesters, cskills: s});
                                    }
                                    else{
                                        res.sendStatus(400);
                                    }

                                });
                            });
                        }
                    });
                }
                else { // no access get them out of here
                    res.sendStatus(400)
                }
            }
        });
    });

};