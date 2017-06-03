var path = require('path');
var viewPath = path.join( __dirname + "/");

var fs = require('fs');
var _ = require('lodash');

var preferencesDB = require( __components + 'Preferences/preferenceDB.js');
var defaultTool = require( __components + 'Preferences/setupDefaultToolType.js');

module.exports = function( app ) {
    app.route("/preferences")

    .get( function(req,res,next){
        res.render( viewPath + "preferences", { title: 'Preferences', message:'ok'})
    })

    .post(function(req,res,next) {
        var pref = req.body["pref-toolSelect"];
        preferencesDB.setStudentPreferences(req.user.id,"Option", "pref-toolSelect", pref , function(err,result){

            if(!err)
                defaultTool.setupDefaultTool(req, pref);

             //TODO pop or message
            res.location( "/tool");
            res.redirect( "/tool" );
        });
    });

    app.get('/preference/data', function(req,res) {
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
                    res.json(preferences);
                });
            }
        });
    });

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
}