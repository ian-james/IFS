var path = require('path');
var fs = require('fs');
var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");

var dbcfg = require(__configs + "databaseConfig");
var db = require(__configs + "database");
var dbHelpers = require(__components + "Databases/dbHelpers");

var userOptDB = require(__components + "Setup/userOptDB.js");

var _ = require('lodash');

var surveyManager = require(__components + "Survey/surveyManager.js");

// POST/GET requests
module.exports = function(app) {
    app.route("/setup")

    .get(function(req,res,next) {
        res.render(viewPath + "setup", { title: 'Setup', message: 'ok' });
    });

    app.get('/setup/data.json', function(req, res, next) {
        var userId = req.user.id;
        var setupFile = './config/setup.json';
        var researchFile = "./data/research/researchDescription"
        fs.readFile(researchFile, 'utf-8', function(ferr, fdata) {
            fs.readFile(setupFile, 'utf-8', function(err, data) {
                if(err) {
                    //Unable to get setup options file, larger problem here.
                    Logger.error(err);
                    res.status(500);
                    res.end();
                } else {
                    var jsonObj = JSON.parse(data);
                    var setup = jsonObj['setup'];
                    if(fdata) {
                        setup['researchDescription'] = fdata;
                    }
                    res.json(setup);
                }
            });
        })
        
    });

    app.get('/setup/values.json', function(req, res, next) {
        var values = [];
        userOptDB.getUserOptIn(req.user.id, function(err, optin) {
            var obj = {
                "name": "optin",
                "value": optin[0].optedIn
            }
            values.push(obj);
            res.json(values);
        });
    });

    app.post('/setup', function(req, res, next) {
        var userId = req.user.id;
        // build array of options and values for the setup form
        var keys = [];
        var enabled = [];
        var disabled = [];
        for (var key in req.body)
            keys.push(key);
        // filter inputs; search for boxes that were not checked; check for '-hidden' in the input name
        for (var key in keys) {
            var i = keys[key].indexOf("-hidden");
            if (i >= 0) {
                var keyname = keys[key].substr(0, keys[key].indexOf('-hidden'));
                // if the input (without the '-hidden' suffix) was not in the form, but the hidden input was, then the box was disabled
                if (keys.indexOf(keyname) == -1)
                    disabled.push(keyname);
                // if the inout (without the '-hidden' suffix) was in the form. then it was enabled
                else
                    enabled.push(keyname);
            }
        }

        // handle setup options
        // deal with experiment opt-in / opt-out
        if (enabled.indexOf('optin') >= 0) {
            surveyManager.setAbleAllSurveyPreferences( req.user.id, 1, function(ableErr, ableResult) {
                userOptDB.toggleOptedIn(userId, 1, function(err, optin) {
                    if (err)
                        Logger.log("ERROR", err);
                    else
                        Logger.log("UID " + userId + " opted-in");
                });
            });
        } else {
            surveyManager.setAbleAllSurveyPreferences( req.user.id, 0, function(ableErr, ableResult) {
                userOptDB.toggleOptedIn(userId, 0, function(err, optin) {
                    if (err)
                        Logger.log("ERROR", err);
                    else
                        Logger.log("UID " + userId + " opted-out");
                });
            });
        }

        res.redirect("/courses");
    });
}
