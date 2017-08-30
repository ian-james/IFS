var path = require('path');
var viewPath = path.join(__dirname + "/");
var Logger = require(__configs + "loggingConfig");
var _ = require('lodash');


var dbcfg = require(__configs + "databaseConfig");
var db = require(__configs + "database");
var coursesDB = require(__components + 'Courses/coursesDB.js');
var profileDB = require(__components + 'StudentProfile/studentProfileDB.js');
var dbHelpers = require(__components + "Databases/dbHelpers");
var coursesDB = require(__components + "Courses/coursesDB.js");

module.exports = function(app) {

    app.get('/courses', function(req,res){
        res.render(viewPath + "courses", { title: 'Course Selection', message: 'ok' });
    });

    app.get('/courses/courses.json', function(req, res) {
        coursesDB.getAllCourses(function(err, courses) {
            res.json(courses);
        });
    });

    app.get('/courses/enrolled.json', function(req, res) {
        profileDB.getStudentProfileAndClasses(req.user.id, function(err, enrolled) {
            res.json(enrolled);
        });
    });

    app.post('/courses', function(req, res, next) {
        var userId = req.user.id;
        // build array of courses and values for enrolment / unenrolment
        // use the *-hidden form fields if no value was posted with the checkbox
        var keys = [];
        var enrol = [];
        var unenrol = [];
        for (var key in req.body)
            keys.push(key);
        // filter inputs; search for boxes that were not checked
        for (var key in keys) {
            var i = keys[key].indexOf("-hidden");
            if (i >= 0) {
                var keyname = keys[key].substr(0,keys[key].indexOf('-hidden'));
                // if the course (without the '-hidden' suffix) was not in the form, but the hidden input was, then unenrol from the course
                if (keys.indexOf(keyname) == -1)
                    unenrol.push(keyname);
                // if the course (without the '-hidden' suffix) was in the form, then it should be enrolled
                else
                    enrol.push(keyname);
            }
        }

        // enrol in specified courses
        for (var e in enrol) {
            coursesDB.getCourse(enrol[e], function(err, course) {
                if (err) {
                    Logger.error("ERROR", err);
                } else {
                    coursesDB.enrolInCourse(userId, course[0].id, function(err, res) {
                        if (err)
                            Logger.error("ERROR", err);
                        else
                            Logger.log("Enrolled in course:", course[0].code, "(UID " + userId + ")");
                    });
                }
            });
        }
        // unenrol from specified courses
        for (var u in unenrol) {
            coursesDB.getCourse(unenrol[u], function(err, course) {
                if (err) {
                    Logger.log("ERROR", err);
                } else {
                    coursesDB.unenrolFromCourse(userId, course[0].id, function(err, res) {
                        if (err)
                            Logger.log("ERROR", err);
                        else
                            Logger.log("Unenrolled from course:", course[0].code, "(UID " + userId + ")");
                    });
                }
            });
        }

        var q = dbHelpers.buildUpdate(dbcfg.user_registration_table) + 'SET completedSetup = ? WHERE userId = ?';
        db.query(q, [1, req.user.id], function(err, data) {
            if (!err)
                Logger.info("UID " + req.user.id + " completed setup.");
            else
                Logger.error("ERROR", err);
            res.redirect('/preferences');
        });        
        
    });

    // this route exists to mark that set-up has been completed for the user
    app.post('/complete-setup', function(req, res, next) {
       
    });
}
