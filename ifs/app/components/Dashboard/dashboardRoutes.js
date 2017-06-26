var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");
var async = require('async');
var _ = require('lodash');

var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");

var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var dbHelpers = require(__components + "Databases/dbHelpers");

var studentProfile = require(__components + "StudentProfile/studentProfileDB");
var upcomingEvents = require(__components + "StudentProfile/upcomingEventsDB");
var studentSkill = require(__components + "StudentProfile/studentSkillDB");

module.exports = function (app, iosocket ) {

    app.get('/dashboard', function( req, res, next ) {

        /* ALl this information should be stored via an initial sign up survey  but for now */
        // MYSQL quick easy tests
        // 
        // Several tables modified: assignment,class,
        // New: class_skill,student_skill and upcoming_event
        // 
        // You'll want to sign up for a new accout after restarting and dropping modified tables
        // 
        // Once you've done that you should be able to use all the commands below to generate some tests data.

        /* INSERT classess
            INSERT INTO class (code,name,description,disciplineType) VALUES ( "CS001", "TESTER", "DO lots of work", 'computer science')
            INSERT INTO class (code,name,description,disciplineType) VALUES ( "UNI001", MULTI_TEST", "bird course", 'other')
        */
       
        /*  Student in the class/course
            // Assuming student ID =1 and classId =2
            INSERT INTO student_class (studentId,classId) VALUES (1,2)
        */
       
        /* INSERT EVENTS
            INSERT INTO upcoming_event (classId, name,title, description, openDate,closedDate ) VALUES (2,"HALLO", "WEEN", "OCT special", NOW(), NOW() + INTERVAL 30 DAY)
        */

        /*
            Class Skill
            INSERT INTO class_skill (classId,assignmentId,name,description) VALUES (2,NULL,"Skill1","You should have 1 skill");
            INSERT INTO class_skill (classId,assignmentId,name,description) VALUES (2,NULL,"Skill2","You should have 2 skills");
            INSERT INTO class_skill (classId,assignmentId,name,description) VALUES (2,NULL,"Skill3","Woah that is too many skills.");


            //Class and skill
            select c.code, c.name,cs.assignmentId,cs.name, cs.description from student s, student_class sc, class_skill cs, class c  
            where s.id = sc.studentId and sc.classId = cs.classId and c.id = cs.classId and  s.userId = 2

            // Student Skills  (which have values)
            INSERT into student_skill (studentId,classSkillId, value) VALUES(1,3,0.75);
            INSERT into student_skill (studentId,classSkillId, value) VALUES(1,2,0.15);
        */
        
        studentProfile.getStudentProfileAndClasses(req.user.id, function(err, studentData){

            if(studentData) {
                var studentKeys = ["id","name", "bio", "avatarFileName"];
                //Note courseName is alias tag to differentiate between student and course.
                var courseKeys = ["code","courseName","description","disciplineType"];
                var studentProfile = _.pick(studentData[0], studentKeys);

                // Select Courses/class data
                var courses = _.map(studentData, obj => _.pick(obj,courseKeys));
                // Retrieve the upcoming events.
                upcomingEvents.getStudentUpcomingEvents(req.user.id , function( errEvents, upcomingEventsData) {
                    var studentStats = [];
                    var eventsKeys = ['title','description','closedDate'];
                    var upEvents = _.map(upcomingEventsData, obj => _.pick(obj,eventsKeys));

                    studentSkill.getStudentTop3Skills(studentProfile.id , function(errSkill, skillsData) {
                        var skillsKeys = ['name','value'];
                        studentStats = _.map(skillsData, obj => _.pick(obj,skillsKeys));
                        res.render( viewPath + "dashboard", { "title":"Dashboard", "studentProfile":studentProfile, "courses": courses, "upcomingEvents": upEvents, 'studentStats': studentStats });
                    });
                });
            }
            else {
                res.status(500).end();
            }
        });
    });
}
