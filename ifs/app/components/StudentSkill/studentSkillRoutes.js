var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");
var _ = require('lodash');

var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");

var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var dbHelpers = require(__components + "Databases/dbHelpers");

var studentProfile = require(__components + "StudentProfile/studentProfileDB");
var upcomingEvents = require(__components + "StudentProfile/upcomingEventsDB");
var studentSkill = require(__components + "StudentProfile/studentSkillDB");

module.exports = function(app, iosocket) {

    app.get('/studentSkills', function(req,res) {
        // Get the class skills
        // Get student and class Skill;
        // getStudentClassSkills
        var userId = req.user.id;
        studentSkill.getUserSkills( userId, function( errUserSkills, userSkills ) {
            studentSkill.getStudentClassSkills( userId, function( err,classSkills ) {
                console.log(userSkills);
                console.log(classSkills);

                //TODO: FIlter the results from classSkills
                // Organize the display.
                
                classSkills = _.differenceBy(classSkills,userSkills,'classSkillId');

                var page = {
                    'title': "Student Skill Set",
                    'userRatedSkills': userSkills,
                    'classSkills': classSkills
                };
                res.render( viewPath + "studentSkill", page );
            });
        });
    });

    app.post('/studentSkill', function(req,res) {
        console.log("STUDENT SKILL VALUES", req.body);
        res.render(viewPath + "../Dashboard/dashboard");
    });
}
