var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");
var Survey = require( __components + "/Survey/survey");
var Question = require( __components + "Survey/question")
var Errors = require(__components + "Errors/errors");

var SurveyBuilder = require( __components + "Survey/surveyBuilder");


module.exports = function (app) {

    /**
     * Create  basic Survey information and store it in database.
     *     Creation of Survey Information needs to occur before buildSurvey
     * @param  {[type]} req  [description]
     * @param  {Array}  res) {                   var surveyNames [description]
     * @return {[type]}      [description]
     */
    app.get( '/createSurveys', function(req,res) {

        var surveyNames = ["CPSEPS","GSE"];
        var surveyAuthors = ["Unknown", "Unknown"];
        var surveyTitle = ["Computer Programming Self-Efficacy Survey", "General Self-Efficacy"];
        var surveyFiles = [ "data/surveys/surveyCPSEPS.json", "data/surveys/surveyGSE.json" ];
        var allData = _.zip(surveyNames, surveyAuthors, surveyTitle, surveyFiles);

        async.map(allData,
            Survey.insertSurvey,
            function(err){
                if(err)
                    console.log("Insert failed with error", err);
                console.log("FINISHED");
                res.end();
            }
        );
    });

    /**
     * This function is for testing, it will build  and store in DB whichever survey with default params
     * Default params are English and Matrix Question Type
     * Note Questions are placed in separted json files, so those are loaded here as well.
     *     There is a different function to create Surveys
     * @param  {[type]} req  [description]
     * @param  {Array}  res) {                   var surveyNames [description]
     * @return {[type]}      [description]
     */
    app.get( '/buildDefaultSurvey:n', function(req,res) {
        var surveyNames = ["CPSEPS","GSE"];
        var surveyAuthors = ["Unknown","Unknown"];
        var surveyFiles = [ "data/surveys/CPSEPS.json", 
                            "data/surveys/GSE.json" 
                            /*, "data/survey/SCEQ/sceq.json",
                            "data/survey/SEWS/sews.json" */];
        var i = req.params.n;

        Survey.getSurvey(surveyNames[i], function(err,data) {
             if( err )
                Logger.error(err);
            else {
                if( data.length >= 1){
                    var survey = data[0];
                    console.log("DATA SurveyName ", data[0].surveyName);
                
                    var surveyFile = surveyFiles[i];
                    console.log("SurveyFile to load is ", surveyFile);
                    fs.readFile(surveyFiles[i], "utf-8", function(err,fileData){
                        if(err)
                            console.log("Can't read file:",surveyFiles[i]);
                        else {
                            var jsonData = JSON.parse(fileData);
                            // For each question insert
                            if(jsonData['QuestionText']){
                                var dde = [];
                                for( var j = 0; j < jsonData['QuestionText'].length;j++ ) {
                                    console.log("JSON j =", jsonData['QuestionText'][j]);
                                    var defaultData = [
                                        survey.id, 
                                        'English',
                                        j,
                                        jsonData['QuestionText'][j], 
                                        "app/components/Survey/SurveyViews/matrixSurveyView.json",
                                        "matrix",
                                    ]
                                    dde.push( defaultData );
                                }
                                console.log("RUN ASYNC");
                                async.map( dde,  
                                    Question.insertQuestion,
                                    function(err){
                                        if(err)
                                            console.log("Insert failed with error", err);
                                        console.log("FINISHED");
                                        res.end();
                                    }
                                );
                            }
                        }

                    });
               }
            }
            res.end();
        });
    });

    app.get( '/deleteSurvey', function(req,res) {
        Survey.deleteSurvey( ['TEST_SURVEY'], function(err, data ){
            if(err)
                Errors.logErr(err);
            else
                console.log("Successfully inserted data");
            res.end();
        });
    });

    //TODO: Immediately, need a public folder for paths but not changing the directory structure
    // On this branch, for the momement. I'm testing that we can load full surveys using this function.
    app.get('/survey:surveyName', function(req,res) {
        var surveyName = req.params.surveyName;

        Survey.getSurvey(surveyName, function(err,surveyData) {
            if( err ) {
                Logger.error(err);
                console.log("FIRST ERROR");
            }
            else if(surveyData.length >= 1 && surveyData[0].surveyName == surveyName)
            {
                SurveyBuilder.loadSurveyFile( surveyData, function(err,data){
                    var sqs = JSON.stringify(data);
                    res.render(viewPath + "questionsLayout", { "title": 'Survey', "surveyQuestions": sqs} );
                });
            }
            else {
                // Could throw an error here indicating failure to reach survey
                res.end();
            }
        });
    });

    app.get('/sec/:surveyName/:low/:high', function(req,res) {
        var surveyName = req.params.surveyName;
        var range = [Math.max(0,Math.min(req.params.low, req.params.high)),Math.max(req.params.low, req.params.high) ];

        Survey.getSurvey(surveyName, function(err,surveyData) {
            if( err ) {
                console.log("Error getting Survey");
                Logger.error(err);
            }
            else if(surveyData.length >= 1 && surveyData[0].surveyName == surveyName)
            {
                var options = { "range": range, "questionsPerPage":4, "splitQuestionTypes": true };
                SurveyBuilder.getSurveySection(surveyData, options,  function(err,data){
                    var sqs = JSON.stringify(data);
                    res.render(viewPath + "questionsLayout", { "title": 'Survey', "surveyQuestions": sqs} );
                });
            }
            else {
                res.end();
            }
        });
    });

     app.get('/GSE:low', function(req,res) {
        var surveyName = "GSE";
        var range = [Math.max(0,Math.min(req.params.low, 8)),Math.max(req.params.low, 8) ];

        Survey.getSurvey(surveyName, function(err,surveyData) {
            if( err ) {
                console.log("Error getting Survey");
                Logger.error(err);
            }
            else if(surveyData.length >= 1 && surveyData[0].surveyName == surveyName)
            {
                var options = { "range": range, "questionsPerPage":5, "splitQuestionTypes": true };
                SurveyBuilder.getSurveySection(surveyData, options,  function(err,data){
                    var sqs = JSON.stringify(data);
                    res.render(viewPath + "questionsLayout", { "title": 'Survey', "surveyQuestions": sqs} );
                });
            }
            else {
                res.end();
            }
        });
    });

      app.get('/CPSEPS:high', function(req,res) {
        var surveyName = "CPSEPS";
        var range = [Math.max(0,Math.min(2, req.params.high)),Math.max(0, req.params.high) ];

        Survey.getSurvey(surveyName, function(err,surveyData) {
            if( err ) {
                console.log("Error getting Survey");
                Logger.error(err);
            }
            else if(surveyData.length >= 1 && surveyData[0].surveyName == surveyName)
            {
                var options = { "range": range, "questionsPerPage":2, "splitQuestionTypes": true };
                SurveyBuilder.getSurveySection(surveyData, options,  function(err,data){
                    var sqs = JSON.stringify(data);
                    res.render(viewPath + "questionsLayout", { "title": 'Survey', "surveyQuestions": sqs} );
                });
            }
            else {
                res.end();
            }
        });
    });
}