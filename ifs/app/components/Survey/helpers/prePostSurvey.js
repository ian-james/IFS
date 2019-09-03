const path = require('path');
const async = require('async');
var dbHelpers = require(__components + "Databases/dbHelpers");
var dbcfg = require(__configs + "databaseConfig");
var db = require(__configs + "database");

const appDefaults = require( __configs + "appDefaults.json" );
const moment = require('moment');

const { Survey } = require(path.join(__modelPath, 'survey'));
const { ClassSurvey } = require(path.join(__modelPath, 'classSurvey'));
const { StudentClass } = require(path.join(__modelPath, 'studentClass'));


// Survey Tests will be set multiple times per year.
// We need to identify which test we are interacting with (time in the year)
// If first time after pre-test start date (reset ) pulse survey not done
//  Once pretest done.


 /**
  * [description] - This function inserts a timestamp of when/which tests
  *                 a user completes. This is seperate than their survey answers since it indicates.
  *                 when they have complete a pre and post test.
  * @param  {[type]}   userId     [description]
  * @param  {[type]}   surveyId   [description]
  * @param  {[type]}   surveyName [description]
  * @param  {Function} callback   [description]
  * @return {[type]}              [description]
  */
let insertPrePostSurveyResult = ( userId, surveyId, surveyName, callback ) => {

    var currentData = getSurveyMeta( __experimentSettings.options.surveyMeta.testMeta );
    testName = "";
    if( currentData )
        testName = currentData.name;

    var req = "insert into " + dbcfg.prePostSurvey_table  +  " " +  dbHelpers.buildValues(["userId","testName","surveyId", "surveyName"])
    db.query(req, [userId,testName,surveyId, surveyName], function(err,data){
        callback(err,data);
    });
}


/**
 * [description] - This section gets the active portion of the test. The pre or the post date that is closest other returns null.
 * @param  {[type]} metaTest - this is a section of the experimentConfig metaTest.
 * @param  {[type]} date     date if needed to compare
 * @return {[type]}          date or null
 */
const getActiveSurveyTestDate = ( metaTest, date ) => {

    if( !date )
        date = new moment();

    var res  = null;
    if(metaTest){

        if( date.isAfter(metaTest.endDate,"month-day") ) {
            res = null;
        }
        else if( date.isSameOrAfter(metaTest.postDate,"month-day" ) ) {
            res = metaTest.postDate;
        }
        else if( date.isSameOrAfter(metaTest.preDate , "month-day") ) {
            res = metaTest.preDate;
        }
    }
    return res;
};



/**
 * [description] getSurveyMeta - searches through the survey meta data in experimentConfig.
 *                             - identifies which survey meta data applies for the curren date in the date ranges.
 * @param  {[type]} metaData [description]
 * @return {[type]}          [description]
 */
const getSurveyMeta = ( metaData ) => {

    if( metaData == null || metaData.length == 0)
        return null;

    var today = new moment();
    var bestMatch = null, i=0;
    for( i = 0; i < metaData.length; i++)
    {
        var start = moment( metaData[i].startDate, appDefaults.dateFormat );
        var end = moment( metaData[i].endDate, appDefaults.dateFormat);

        if( !(today.isBefore(start,"month-day") || today.isAfter(end,"month-day") ) )
            bestMatch = i;
    }
    if(bestMatch != null )
        return metaData[bestMatch];
    return null;
};


/**
 * [description] completedRecentSurveys - This function checks that the user has completed each required survey since the start of a time period.
 *                                         Time periods are basically a semester in which the IFS administers pre/post surveys for all available surveys.
 *                                         Survey data is describe as part of the experimentConfig.json properties by the researcher.
  * @param  {[type]}   userId   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            This function is basically a boolean function for if they have completed all surveys.
 *                                  Note: Survey might always be active so this function fails gracefully.
 *                                  return error indicates the students does not need to perform more surveys.
 */
let completedRecentSurveyTest = async (userId, callback) => {

    // Identify which pre/post test is currently being administered to students.
    var currentData = getSurveyMeta( __experimentSettings.options.surveyMeta.testMeta );
    if( currentData )
    {
        const classIds = await StudentClass.query().select('classId').where('studentId', userId);
        const surveyCount = await ClassSurvey.query().select(['surveyId']).whereIn('classId', classIds);

        var q = "select surveyId, surveyName, count(*) as times from " + dbcfg.prePostSurvey_table + " where userId = ? and testCompletedDate >= ? and testCompletedDate <= ? GROUP BY surveyId, surveyName";
        db.query( q, [userId, currentData.startDate, currentData.endDate ] , function(err, data){
            if(err)
                callback("Could not determine any surveys within the start and end date period.");
            else {
                if(surveyCount && data)
                {
                    if( surveyCount.length <= data.length )
                        callback("Student has completed all surveys.");
                    else
                        callback(null, data);
                }
                else
                    callback("No suryves available to complete.");
            }
        });
    }
    else
        callback("Survey Meta data was not found, no surveys are required at this time.");
};

module.exports.insertPrePostSurveyResult = insertPrePostSurveyResult;
module.exports.getSurveyMeta = getSurveyMeta;
module.exports.completedRecentSurveyTest = completedRecentSurveyTest;
module.exports.getActiveSurveyTestDate = getActiveSurveyTestDate;