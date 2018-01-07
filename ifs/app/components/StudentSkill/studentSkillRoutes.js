var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");
var _ = require('lodash');
var async = require('async');

var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");

var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var dbHelpers = require(__components + "Databases/dbHelpers");
var event = require(__components + "InteractionEvents/buildEvent.js" );
var tracker = require(__components + "InteractionEvents/trackEvents.js" );

var studentProfile = require(__components + "StudentProfile/studentProfileDB");
var upcomingEvents = require(__components + "StudentProfile/upcomingEventsDB");
var studentSkill = require(__components + "StudentProfile/studentSkillDB");

module.exports = function(app, iosocket) {

    app.get('/skills', function(req,res) {
        // Get the class skills
        // Get student and class Skill;
        // getStudentClassSkills
        var userId = req.user.id;

        studentProfile.getStudentProfile(req.user.id, function(err, profileData)  {
            var studentId = profileData  && profileData.length > 0 ? profileData[0].id : -1;
            studentSkill.getStudentSkills( studentId, function( errUserSkills, userSkills ) {
                studentSkill.getStudentClassSkills( studentId, function( err,classSkills ) {
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
    });

    app.post('/skills', function(req,res) {

        studentProfile.getStudentProfile(req.user.id, function(err, profileData) {
            if( profileData && profileData.length > 0) {
                var studentId = profileData[0].id;
                var skills = req.body;

                var userKey = 'userRatedSkills';
                var classKey = 'classSkills';
                var idx = -1;

                async.eachOf(skills, function( value,key, callback ) {
                        if( value[1] == 'yes' ) {
                            var m = key.toString().match( /[a-zA-Z]*(\d*)/);
                            if( m && m.length > 1 ) {
                                idx = parseInt(m[1]);
                                if( value[0] )
                                {
                                    var rateValue = parseInt(value[0])/100;
                                    var obj = {
                                       "userRatedSkill": idx,
                                       "value": rateValue
                                    };
                                    tracker.trackEvent( iosocket, event.changeEvent(req.user.sessionId, req.user.id, "userRatedSkill", JSON.stringify(obj)));
                                    if( _.startsWith(key, userKey) )
                                        studentSkill.insertStudentSkills(studentId, idx, rateValue, callback);
                                    else if( _.startsWith(key, classKey) )
                                        studentSkill.insertStudentSkills( studentId, idx, rateValue, callback );
                                }
                            }
                        }
                    }, function(err){
                        if(err)
                            Logger.error(err);
                        else
                            Logger.log("Finished setting up.");
                    }
                );
            }

            res.location('/dashboard');
            res.redirect("/dashboard");
        });
    });
}
