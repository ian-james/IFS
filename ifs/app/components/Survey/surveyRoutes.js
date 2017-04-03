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
     * Information is stored to quickly create survey information
     * This information shouldn't change unless a new survey is added.
     * @return {[type]} [description]
     */
    function getStaticSurveyData(){
        var surveyNames = ["CPSEPS","GSE","SEWS", "AGQ"];
        var surveyAuthors = ["Unknown", "Unknown","Unknown","Unknown"];
        var surveyTitle = ["Computer Programming Self-Efficacy Survey", "General Self-Efficacy",
                            "Self-Efficacy Writing Scale", "Achievement Goal Questionnaire"];
        var surveyFiles = [ "data/surveys/surveyCPSEPS.json", "data/surveys/surveyGSE.json",
                            "data/surveys/surveySEWS.json", "data/surveys/surveyAGQ.json" ];
        var allData = _.zip(surveyNames, surveyAuthors, surveyTitle, surveyFiles);
        return allData();
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

        var allSurveys = getStaticSurveyData();
        var i = Math.max(0, Math.min(req.params.n,allSurveys.length-1));

        var [ surveyName, surveyAuthors,surveyTitle, surveyFile] = allSurveys[i];

        Survey.getSurvey(surveyName, function(err,data) {
             if( err )
                Logger.error(err);
            else {
                if( data.length >= 1){
                    var survey = data[0];
                    console.log("DATA SurveyName ", data[0].surveyName);
                
                    var surveyFile = surveyFile;
                    console.log("SurveyFile to load is ", surveyFile);
                    fs.readFile(surveyFile, "utf-8", function(err,fileData){
                        if(err)
                            console.log("Can't read file:",surveyFile);
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

    /*
    /// Needs to be tested, in more depth.
    app.get( '/deleteSurvey', function(req,res) {
        Survey.deleteSurvey( ['TEST_SURVEY'], function(err, data ){
            if(err)
                Errors.logErr(err);
            else
                console.log("Successfully inserted data");
            res.end();
        });
    });
    */

    /**
     * Method gets the full survey and displays it.
     * @param  {[type]} req  [description]
     * @param  {[type]} res) {                   var surveyName [description]
     * @return {[type]}      [description]
     */
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

    /**
     * This route get a survey by name and specific section of questions.
     * Also allows options parameters to be set.
     * @param  {[type]} req  [description]
     * @param  {[type]} res) {                   var surveyName [description]
     * @return {[type]}      [description]
     */
    app.get('/surveySec/:surveyName/:low/:high/:questionsPerPage?/:splitQuestionTypes?', function(req,res) {
        var surveyName = req.params.surveyName;
        var range = [Math.max(0,Math.min(req.params.low, req.params.high)),Math.max(req.params.low, req.params.high) ];

        var questionsPerPage  = req.params.questionsPerPage || 4;
        var splitQuestionTypes =  req.params.splitQuestionTypes || true;

        Survey.getSurvey(surveyName, function(err,surveyData) {
            if( err ) {
                Logger.error(err);
            }
            else if(surveyData.length >= 1 && surveyData[0].surveyName == surveyName)
            {
                var options = { "range": range, "questionsPerPage":questionsPerPage, "splitQuestionTypes": splitQuestionTypes };
                SurveyBuilder.getSurveySection(surveyData, options,  function(err,data){
                    var sqs = JSON.stringify(data);
                    res.redirect('/surveySec');
                    res.render(viewPath + "questionsLayout", { "title": 'Survey', "surveyQuestions": sqs} );
                    //res.send(sqs);
                    //res.end();
                });
            }
            else {
                res.end();
            }
        });
    });
}