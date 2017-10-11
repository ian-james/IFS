var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require('fs');
var multer = require('multer');
var Logger = require( __configs + "loggingConfig");

var _ = require('lodash');
var url = require('url');

var preferencesDB = require(__components + 'Preferences/preferenceDB.js');
var profileDB = require(__components + 'StudentProfile/studentProfileDB.js');
var defaultTool = require(__components + 'Preferences/setupDefaultToolType.js');

var sanitization = require(__configs + 'sanitization');
var validator = require('validator');

// multer config
var limits = { fileSize: 51200 };
var fileFilter = function(req, file, cb) {
    var filetype = /png/;
    var mimetype = filetype.test(file.mimetype);
    var extension = filetype.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extension) {
        return cb(null, true);
    } else {
        cb("Error: Only " + filetype + "files are allowed.", false);
    }
};
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var userId = req.user.id;
        var basepath = 'app/shared/img/user/';
        var submissionFolder = path.join(basepath, req.user.id.toString());
        cb(null, submissionFolder);
    },
    filename: function(req, file, cb) {
        cb(null, 'avatar.png');
    },
});
var upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
});

// POST/GET requests
module.exports = function(app) {
    app.get('/preferences', function(req,res,next) {
        var err = false;
        var msg = "";
        if (req.query.err === 'name' || req.query.err === 'bio') {
                msg = "Illegal characters in " + req.query.err + ". Please try again.";
                err = true;
        } else if (req.query.success) {
            msg = "Success! Your changes have been saved.";
        }
        res.render(viewPath + "preferences", {title: 'Preferences', message: msg, err: err})
    });

    app.get('/preferences/data.json', function(req, res) {
        var preferencesFile = './config/preferencesList.json';
        fs.readFile(preferencesFile, 'utf-8', function(err, data) {
            if(err) {
                //Unable to get support tools file, larger problem here.
                Logger.error(err);
                res.end();
            } else {
                var jsonObj = JSON.parse(data);
                var preferences = jsonObj['preferences'];

                preferencesDB.getStudentPreferencesByToolType(req.user.id, "Option", function(err, preferencesDB) {
                    if(!err)
                        updateJsonWithDbValues(preferencesDB, preferences.options);

                    profileDB.getStudentProfile(req.user.id, function(perr, profile ) {
                        setupProfile(preferences.options, profile);
                        res.json(preferences);
                    });
                });
            }
        });
    });


    app.post('/preferences/profile', upload.single('student-avatar'), function(req, res, next) {
        var userId = req.user.id;
        var pref = req.body["pref-toolSelect"];
        var tipsOn = req.body["pref-tipsAllowed"] ? req.body["pref-tipsAllowed"] : "off";
        var studentName = req.body['student-name'];
        var studentBio = req.body['student-bio'];
        var error = false;

        if (!sanitization.validateText(studentName, 'title')) {
            res.redirect(url.format({
                pathname:"/preferences",
                query: { err: "name" }
            }));
            error = true;
        }
        if (!sanitization.validateText(studentBio, 'par') && !error) {
            res.redirect(url.format({
                pathname: "/preferences",
                query: { err: "bio" }
            }));
            error = true;
        }

        if(pref && !error) {
            preferencesDB.setStudentPreferences(userId, "Option", "pref-toolSelect", pref , function(err,result){
                preferencesDB.setStudentPreferences(userId, "Option", "pref-tipsAllowed",tipsOn, function(err1,result1) {
                    if(!err)
                        defaultTool.setupDefaultTool(req, pref);

                    profileDB.setStudentProfile(userId, studentName, studentBio, function(err, presult) {
                        if(err)
                            Logger.log("ERROR SETTING STUDENT PROFILE");
                        else {
                            res.redirect(url.format({
                                pathname: '/tool'
                            }));
                        }

                    });
                });
            });
        } else {
            Logger.log("ERROR IN POSTING PROFILE PREFERENCES");
            res.end();
        }
    });


    /**
     * Update default preferences with DB values for specific user.
     * @param  {[type]} preferencesDB      [description]
     * @param  {[type]} preferencesOptions [description]
     * @return {[type]}                    [description]
     */
    function updateJsonWithDbValues( preferencesDB, preferencesOptions) {
        var prefPrefix = "pref-"
        for(var i = 0; i < preferencesDB.length; i++) {
            var optionName = preferencesDB[i].toolName;

            if(_.startsWith(optionName,prefPrefix)) {
                var r = _.find(preferencesOptions,_.matchesProperty('name',optionName));
                 if(r){
                    if(r.type == "checkbox")
                        r['prefValue'] = preferencesDB[i].toolValue == "on";
                    else if(r.type == "select")
                        r['prefValue'] = preferencesDB[i].toolValue;
                }
            }
        }
    }

    /**
     * Setup student profile with basic information name, bio, img
     * @param  {[type]} preferenceOptions [description]
     * @param  {[type]} profile           [description]
     * @return {[type]}                   [description]
     */
    function setupProfile(preferenceOptions, profile) {
        if(profile && profile.length > 0) {
            var prefix = "student-"
            var keys = ['name', 'avatarFileName','bio'];
            for(var i = 0; i < keys.length; i++) {
                var r = _.find(preferenceOptions,_.matchesProperty('name',prefix+keys[i]));
                if(r && r.type == "text") {
                    r['prefValue'] =  profile[0][keys[i]] ? profile[0][keys[i]] : "";
                }
            }
        }
    }
}
