var path = require('path');
var viewPath = path.join( __dirname + "/");

var fs = require('fs');
var _ = require('lodash');

var preferencesDB = require( __components + 'Preferences/preferenceDB.js');
var profileDB = require( __components + 'StudentProfile/studentProfileDB.js');
var defaultTool = require( __components + 'Preferences/setupDefaultToolType.js');

module.exports = function( app ) {
    app.route("/preferences")

    .get( function(req,res,next){
        res.render( viewPath + "preferences", { title: 'Preferences', message:'ok'})
    })

    .post(function(req,res,next) {

        console.log("RECEIVEd", req.body);

        var pref = req.body["pref-toolSelect"];
        var studentName = req.body['student-name'];
        var studentBio = req.body['student-bio'];
        var studentAvatar = req.body['student-avatar'];

        preferencesDB.setStudentPreferences(req.user.id,"Option", "pref-toolSelect", pref , function(err,result){

            if(!err)
                defaultTool.setupDefaultTool(req, pref);

            profileDB.setStudentProfile(req.user.id, studentName,studentBio, studentAvatar, function(err, presult) {
                 //TODO pop or message
                res.location( "/tool");
                res.redirect( "/tool" );
            });
        });
    });

    app.get('/preferences/data.json', function(req,res) {
        var preferencesFile = './config/preferencesList.json';
        fs.readFile( preferencesFile, 'utf-8', function( err, data ) {
            if( err ) {
                //Unable to get support tools file, larger problem here.
                Logger.error(err);
                res.end();
            }
            else {
                var jsonObj = JSON.parse(data);
                var preferences = jsonObj['preferences'];

                preferencesDB.getStudentPreferencesByToolType(req.user.id, "Option", function( err, preferencesDB ) {
                    if(!err)
                        updateJsonWithDbValues(preferencesDB, preferences.options );

                    profileDB.getStudentProfile(req.user.id, function( perr, profile ) {
                        setupProfile(preferences.options, profile);
                        res.json(preferences);
                    });
                });
            }
        });
    });


    /**
     * Update default preferences with DB values for specific user.
     * @param  {[type]} preferencesDB      [description]
     * @param  {[type]} preferencesOptions [description]
     * @return {[type]}                    [description]
     */
    function updateJsonWithDbValues( preferencesDB, preferencesOptions) {
        var prefPrefix = "pref-"
        for( var i = 0; i < preferencesDB.length; i++ ) {

            var optionName = preferencesDB[i].toolName;

            if( _.startsWith(optionName,prefPrefix) ) {
                var r = _.find(preferencesOptions,_.matchesProperty('name',optionName));
                 if( r ){
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
    function setupProfile( preferenceOptions, profile ) {

        if( profile && profile.length > 0) {
            var prefix = "student-"
            var keys = ['name', 'avatarFileName','bio'];
            for( var i = 0; i < keys.length; i++ ){
                var r = _.find(preferenceOptions,_.matchesProperty('name',prefix+keys[i])); 
                if( r && r.type == "text") {
                    r['prefValue'] =  profile[0][keys[i]] ? profile[0][keys[i]] : "";
                }
            }
        }
    }
}
