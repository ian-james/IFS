/*
  User Survey Meta Data
 */
var _ = require('lodash');
var Logger = require( __configs + "loggingConfig");

module.exports = {

    /**
     * [createSurveyMeta description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    createSurveyMeta: function( options ) {
        return {
            surveyTitle:"",
            questionsAnswered: []
        };
    },

    /**
     * [userSurveyMeta description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    userSurveyMeta: function( options ) {
         return {
            allowedToAsk: true,
            pauseAsking: false,
            nQuestionsPerAsk: 2,
            lastTimeAsked: 0,
        };
    },
}