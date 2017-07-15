var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

var db = require( __configs + 'database');
var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");
var Survey = require( __components + "/Survey/survey");
var Question = require( __components + "Survey/question")
var Errors = require(__components + "Errors/errors");

var SurveyManager = require( __components + "Survey/surveyManager");
var SurveyBuilder = require( __components + "Survey/surveyBuilder");
var SurveyPreferences = require( __components + "Survey/surveyPreferences");
var SurveyResponse = require(__components + "Survey/surveyResponse");

module.exports = function (app) {
     /**
     * Information is stored to quickly create survey information
     * This information shouldn't change unless a new survey is added.
     * @return {[type]} [description]
     */
    function getStaticSurveyData(){
        //Note Survey Questions is not part of the survey database, its parts of question databasde
        // Thus it's last in the allData variable, so it can be easily extracted.
        var surveyNames = ["CPSEPS","GSE","SEWS", "AGQ"];
        var surveyAuthors = ["Unknown", "Unknown","Unknown","Unknown"];
        var surveyTitle = ["Computer Programming Self-Efficacy Survey", "General Self-Efficacy Survey",
                            "Self-Efficacy Writing Scale", "Achievement Goal Questionnaire"];
        var surveyQuestions = ["data/surveys/CPSEPS.json", "data/surveys/GSE.json",
                            "data/surveys/SEWS.json", "data/surveys/AGQ.json" ];
        var numQs = [28,10,16,12];
        var field = ["programming", "general", "writing", "general"];
        var freq = ['reg','reg','reg','set'];
         var surveyFiles = [ "data/surveys/surveyCPSEPS.json", "data/surveys/surveyGSE.json",
                            "data/surveys/surveySEWS.json", "data/surveys/surveyAGQ.json" ];
        var allData = _.zip(surveyNames, surveyAuthors, surveyTitle,numQs,field,freq, surveyFiles);
        return allData;
    }

    /**
     * Create  basic Survey information and store it in database.
     *     Creation of Survey Information needs to occur before buildSurvey
     * @param  {[type]} req  [description]
     * @param  {Array}  res) {                   var surveyNames [description]
     * @return {[type]}      [description]
     */
    app.get( '/createSurveys', function(req,res) {
        var allData = getStaticSurveyData();
        async.map(allData,
            Survey.insertSurvey,
            function(err){
                if(err)
                    console.log("Insert failed with error", err);
                res.end();
            }
        );
    });

    /**
     * Generate an all matrix survey for a set of questions, read from **surveyQuestions**.json
     * Puts a single page with all likert/matrix type questions in.
     * Use other functions to format. This function doesn't overwrite for safety.
     * @param  {[type]} req  [description]
     * @param  {[type]} res) {                   var allData [description]
     * @return {[type]}      [description]
     */
    app.get( '/generateMatrixSurvey:n', function(req,res) {
        var allData = getStaticSurveyData();

        var allSurveys = getStaticSurveyData();
        var i = Math.max(0, Math.min(req.params.n,allSurveys.length-1));

        // Survey N becomes the default
        var [ surveyName, surveyAuthors,surveyTitle, numQuestions, surveyField, freq, surveyFiles] = allSurveys[i];

        if(fs.existsSync(surveyFiles) ){
            console.log("SURVEY FILE EXISTS, will not overwrite, please remove the local file.");
            res.end();
            return;
        }

        Survey.getSurvey(surveyName, function(err,data) {
             if( err )
                Logger.error(err);
            else {
                if( data.length >= 1){
                    var survey = data[0];
                    var surveyFile = surveyQuestionFile;
                    
                    fs.readFile(surveyFile, "utf-8", function(err,fileData){
                        if(err)
                            console.log("Can't read file:",surveyFile);
                        else {
                            var jsonData = JSON.parse(fileData);
                            // For each question insert
                            if(jsonData['QuestionText']){
                                
                                // Build default Survey and write to file, specified in DB.
                                var s = SurveyBuilder.buildDefaultMatrixSurvey(data[0], jsonData['QuestionText']);
                                s = JSON.stringify(s);
                                fs.writeFileSync(String("./" + data[0].fullSurveyFile), s, 'utf-8');
                                res.end();
                            }
                        }
                    });
                }
            }
        });

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
/*
    app.get( '/buildDefaultSurvey:n', function(req,res) {

        var allSurveys = getStaticSurveyData();
        var i = Math.max(0, Math.min(req.params.n,allSurveys.length-1));

        var [ surveyName, surveyAuthors,surveyTitle, numQs, surveyField, freq, surveyFiles] = allSurveys[i];

        Survey.getSurvey(surveyName, function(err,data) {
             if( err )
                Logger.error(err);
            else {
                if( data.length >= 1){
                    var survey = data[0];
                    var surveyFile = surveyFile
                    
                    fs.readFile(surveyFile, "utf-8", function(err,fileData){
                        if(err)
                            console.log("Can't read file:",surveyFile);
                        else {
                            var jsonData = JSON.parse(fileData);
                            // For each question insert
                            if(jsonData['QuestionText']){
                                var dde = [];
                                for( var j = 0; j < jsonData['QuestionText'].length;j++ ) {
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
                                
                                async.map( dde,  
                                    Question.insertQuestion,
                                    function(err){
                                        if(err)
                                            console.log("Insert failed with error", err);
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
*/
    /**
     * This route get a survey by name and specific section of questions.
     * Also allows options parameters to be set.
     * @param  {[type]} req  [description]
     * @param  {[type]} res) {                   var surveyName [description]
     * @return {[type]}      [description]
     */
/*
    app.get('/surveySec/:surveyName/:low/:high/:questionsPerPage?/:splitQuestionTypes?', function(req,res) {
        var surveyName = req.params.surveyName;
        var range = [Math.max(0,Math.min(req.params.low, req.params.high)),Math.max(req.params.low, req.params.high) ];

        var options = SurveyBuilder.setDisplaySurveyOptions(req.params.questionsPerPage, req.params.splitQuestionTypes,range);

        Survey.getSurvey(surveyName, function(err,surveyData) {
            if( err ) {
                Logger.error(err);
            }
            else if(surveyData.length >= 1 && surveyData[0].surveyName == surveyName)
            {   
                SurveyBuilder.getSurveySection(surveyData, options,  function(err,data){
                    var sqs = JSON.stringify(data);
                    res.send(sqs);
                    res.end();
                });
            }
            else {
                res.end();
            }
        });
    });
*/
    //Helpful little route to create survey prefernces, not sure this will live on.
    app.get('/ips', function(req,res) {
        var userId = req.user.id || req.passport.user;
        SurveyBuilder.setSignupSurveyPreferences( userId, function(err,data) {
            res.end();
        });
    });
}