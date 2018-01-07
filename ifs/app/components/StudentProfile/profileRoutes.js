var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");
var _ = require('lodash');

var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");

var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var dbHelpers = require(__components + "Databases/dbHelpers");

var studentProfile = require(__components + "StudentProfile/studentProfileDB");
var upcomingEvents = require(__components + "StudentProfile/upcomingEventsDB");
var studentSkill = require(__components + "StudentProfile/studentSkillDB");

var preferencesDB = require( __components + 'Preferences/preferenceDB.js');

//var Constants = require( __components + "Constants/programConstants");
//var SurveyBuilder = require(__components + "Survey/surveyBuilder");
//var Survey = require( __components + "Survey/survey");

module.exports = function(app) {
    app.get('/profile/data', function(req,res) {
        var userObj = req.user;
    });

    /**
     * This loads all the survey data required for loading time.
     * @param  {[type]} req  [description]
     * @param  {[type]} res  [description]
     * @param  {[type]} next )             {                var userId [description]
     * @return {[type]}      [description]
     */
    app.get('/profile', function( req, res, next ) {
        var userId = req.user.id;

         /** NOTE:
                The new addition of a student not being in a class was not designed for and thus this database queries breaks.
                getStudentProfileAndClasses mixes together a copule calls/tables student/courses.
                GetStudentProfile is now used (quick fix) instead of studentProfileAndClasses for studentProfile.
                This new design  of classless students will have to be considered in other places too.
                This message can self-destruct after 1 read.
         */

        studentProfile.getStudentProfile(userId, function(err, studentProfileData) {
            studentProfile.getStudentProfileAndClasses(userId, function(err, studentData) {
                if (studentData) {
                    var studentKeys = ["id", "name", "bio"];
                    //Note courseName is alias tag to differentiate between student and course.
                    var courseKeys = ["code","courseName","description","disciplineType"];
                    var studentProfile = _.pick(studentProfileData[0], studentKeys );
                    // Select Courses/class data
                    var courses = _.map(studentData, obj => _.pick(obj,courseKeys));
                    // Retrieve the upcoming events.
                    upcomingEvents.getStudentUpcomingEvents( req.user.id , function( errEvents, upcomingEventsData ) {
                        var studentStats = [];
                        var eventsKeys = ['title','description','closedDate'];
                        var upEvents = _.map(upcomingEventsData, obj => _.pick(obj,eventsKeys));

                        studentSkill.getStudentTop3Skills( studentProfile.id , function(errSkill, skillsData) {
                            var skillsKeys = ['skillName','value'];
                            studentStats = _.map(skillsData, obj => _.pick(obj,skillsKeys));
                            res.render( viewPath + "profile", {
                                "title": "Profile for " + studentProfile.name,
                                "studentProfile": studentProfile,
                                "courses": courses,
                                "upcomingEvents": upEvents,
                                'studentStats': studentStats
                            });
                        });
                    });
                } else
                    res.status(500).end();
            });
        });

    });
}
