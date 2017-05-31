var path = require('path');
var viewPath = path.join( __dirname + "/");

var fs = require('fs');

var preferencesDB = require( __components + 'Preferences/preferenceDB.js');

module.exports = function( app ) {
    app.route("/preferences")

    .get( function(req,res,next){
        res.render( viewPath + "preferences", { title: 'Preferences', message:'ok'})
    })

    .post(function(req,res,next) {
        if( req.body ) {
            // TODO: Preferences aren't saved anywhere except this variable.
            // Partially because we don't have preferences yet
            // This will create a minor bug in that
            if( req.session) {
                req.session.toolSelect = req.body.toolSelect;
                req.session.toolFile = req.body.toolSelect == "Programming" ? './tools/toolListProgramming.json' :  './tools/toolList.json';
            }
        }

        //TODO pop or message
        res.location( "/tool");
        res.redirect( "/tool" );
    });

    app.get('/preference/data', function(req,res) {
        var preferencesFile = './users/preferencesList.json';
        fs.readFile( preferencesFile, 'utf-8', function( err, data ) {
            if( err ) {
                //Unable to get support tools file, larger problem here.
                Logger.error(err);
                res.end();
            }
            else {
                var jsonObj = JSON.parse(data);
                res.json(jsonObj['preferences']);
            }
        });
    });

    
    app.get('/testPref', function(req,res){

        /*
        preferencesDB.clearStudentFormPreferences(req.user.id, req.session.toolSelect, function(err,data){
            console.log("Error", err);
            console.log("Result", data);
        });
        */
        /*
        preferencesDB.setStudentPreferences(req.user.id, "fakeTool2", "SOmething", function(err,data){
            if(err) {
                console.log(err);
            }
            else {
                console.log("Data",data);
                console.log("****************************************** 0 ");
                preferencesDB.getStudentPreferences(req.user.id, function( err1, toolsPrefs ) {
                    if(err1)
                        console.log(err1);
                    else {
                        console.log(toolsPrefs);
                        console.log("****************************************** 1 ");
                        preferencesDB.setStudentPreferences(req.user.id, "fakeTool2", "zzzanotherThing",  function(err2,set2){
                            if(err) {
                                console.log(err);
                            }
                            else {
                                console.log(set2);
                                console.log("****************************************** 2 ");
                                preferencesDB.getStudentPreferencesByTool(req.user.id, "fakeTool2", function(err3, set3) {
                                    console.log("Error", err3);
                                    console.log("Result", set3);
                                });
                            }
                        });
                    }
                });
            }
        });
        */
    });
}

