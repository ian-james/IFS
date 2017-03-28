var path = require('path');
var fs = require('fs');
var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");

module.exports = function (app) {

    // Allow sellecting survey
    app.get('/survey', function(req,res) {
        var filename = "app/components/Survey/testSurvey.json"
        fs.readFile( filename, "utf-8", function( err, data ) {
            if( err ) {
                //Unable to get support tools file, larger problem here.
                Logger.error("Error to load survey");
            }
            else {
                var sq  = JSON.parse(data);
                var sqs = JSON.stringify(sq);
                
                res.render(viewPath + "questionsLayout", { "title": 'Survey', "surveyQuestions": sqs} );
            }
        });
    });

    app.post('/survey', function(req,res) {
        //TODO;
    });
}