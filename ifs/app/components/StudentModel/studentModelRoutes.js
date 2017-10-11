var path = require('path');
var viewPath = path.join( __dirname + "/");
var _ = require('lodash');
var chart = require('chart.js');
var async = require('async');

var moment = require('moment');
var chartHelpers = require( __components + "Chart/chartHelpers.js");
var studentProfile = require(__components + "StudentProfile/studentProfileDB");
var studentModel = require(__components + "StudentModel/studentModelDB");
var studentSkill = require(__components + "StudentProfile/studentSkillDB");

module.exports = function(app, iosocket) {

    var DEFAULT_DATE_FORMAT = "YYYY-MM-DD"

    /**
     * Retrieve submission information and rap it in chart form.
     * @param  {[type]} req     [description]
     * @param  {[type]} res     [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    function submissionChart(req,res, options) {
        studentModel.getSubmissionsBetweenDates(req.user.id, options.minDate, options.maxDate, function(err,data){
            if(!err) {
                var sessionDates = _.map(data,"sessionDate");
                var values = _.map(data, "value");
                var options = chartHelpers.chartOptions(false,true,"Session Submissions", chartHelpers.makeScale(true,"Session Date"), chartHelpers.makeScale(true,"Submissions"));
                var chartData = chartHelpers.makeChart(sessionDates,values,[], options);
                res.json(chartData);
            }
            res.end();
        });
    }

    /**
     * Creates the feedback items (Error) chart
     * @param  {[type]} req     [description]
     * @param  {[type]} res     [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    function feedbackItemChart(req,res,options){
        studentModel.getFeedbackItemPerSubmissionBetweenDates(req.user.id, options.minDate, options.maxDate, function(err,data){
            if(!err) {
                var groups = _.groupBy(data,"series");
                var options = chartHelpers.chartOptions(true,true,"Feedback Per Submission", chartHelpers.makeScale(true,"Submission Number"), chartHelpers.makeScale(true,"Feedback Items"));
                var chartData = chartHelpers.setupSeriesData(groups, options,function( labels, values) {

                    maxLength = -1;
                    for( var k =0;k<values.length;k++)
                        maxLength = values[k].length > maxLength ? values[k].length : maxLength;

                    var labels =[];
                    for( var k =1;k<=maxLength;k++)
                        labels.push(k);
                    return labels;
                });
                res.json(chartData);
            }
            res.end();
        });
    }

    /**
     * This funciton setups chart for the feedback viewed item and viewed elaborate feedback.
     * @param  {[type]} req     [description]
     * @param  {[type]} res     [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    function feedbackViewedChart(req,res,options) {
         studentModel.getFeedbackViewedPerSubmissionBetweenDates(req.user.id, options.minDate, options.maxDate, function(err,data){
            if(!err) {
                // CREATE EQUAL GROUPS
                var groups = _.groupBy(data,"series");

                // We inject data in both field because somehow viewedMore occured without viewed. Might be an error
                // but easy enough to handle at this point.
                groups['viewedMore'] = chartHelpers.injectDefaultData('viewed', 'viewedMore', groups,0);
                groups['viewed'] = chartHelpers.injectDefaultData('viewedMore', 'viewed',groups,1);

                var options = chartHelpers.chartOptions(true,true,"Feedback Viewed", chartHelpers.makeScale(true,"Session with Feedback View"), chartHelpers.makeScale(true,"Times Viewed"));
                var chartData = chartHelpers.setupSeriesData(groups,options, function( labels, values) {
                    return labels[0];
                }, {
                    'viewed': "Quick View",
                    'viewedMore': "Detailed View"
                });
                res.json(chartData);
            }
            res.end();
        });
    }

    /**
     * Get StudentId from a studentProfile, essentially a wrapper to retrieve data
     *    and then pass it on.
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function getStudentId( data , callback)
    {
       callback(null, _.get(data[0],"id") );
    }

    function studentSelfAssessmentChart(req,res,options) {
        async.waterfall([
            async.apply(studentProfile.getStudentProfile, req.user.id),
            getStudentId,
            studentSkill.getAllStudentSkillsWithDescription,
        ], function(err,results){
            if(err) {
                Logger.error("Unable to create self-assessment graph");
            }
            else {
                // Find self-assessments between specific dates.
                var maxDate = moment(options.maxDate).format(DEFAULT_DATE_FORMAT);
                var minDate = moment(options.minDate).format(DEFAULT_DATE_FORMAT);

                // Remove anything not in the date range.
                _.remove( results, function(rating){
                    var rateTime = moment(rating.lastRated).format(DEFAULT_DATE_FORMAT);
                    return moment(rateTime).isAfter(maxDate) ||
                            moment(rateTime).isBefore(minDate);
                });

                var groups = _.groupBy(results,"skillName");
                // Create a chart show self assessment scores
                var chartOptions = chartHelpers.chartOptions(true,true,"Self-Assessments", chartHelpers.makeScale(true,"Number of Assessments"), chartHelpers.makeScale(true,"Assessment"));
                chartOptions['labelKey'] = 'lastRated';
                var chartData = chartHelpers.setupSeriesData(groups, chartOptions,function(labels, values) {
                            maxLength = -1;
                    for( var k =0;k<values.length;k++)
                        maxLength = values[k].length > maxLength ? values[k].length : maxLength;

                    var labels =[];
                    for( var k =1;k<=maxLength;k++)
                        labels.push(k);
                    return labels;
                });
                res.json(chartData);
            }
            res.end();
        });
    }

    /************************************************** ROUTES *********************************************************************/

    app.get('/studentModel', function(req,res) {
        res.render( viewPath + "studentModel", { "title":"Learner Model" } );
    });

    app.get('/studentModel/data', function(req,res) {
        // Deafult option is for submission chart.
        var options = { minDate: moment("20170701").format(DEFAULT_DATE_FORMAT), maxDate: moment().format(DEFAULT_DATE_FORMAT) };
        submissionChart(req,res, options );
    });

    /**
     * Post changes the data that is shown, uses the dates for the mysql requests.
     * @param  {[type]} req  [description]
     * @param  {[type]} res) {                   if( req.body.studentData && validateDate(req.body.minDate) && validateDate(req.body.maxDate) ) {            if( req.body.studentData.key [description]
     * @return {[type]}      [description]
     */
    app.post('/studentModel/data', function(req, res) {
        if( req.body.studentData && chartHelpers.validateDate(req.body.minDate) && chartHelpers.validateDate(req.body.maxDate) && moment(req.body.maxDate).isAfter(req.body.minDate)) {
            if( req.body.studentData.key == "nsubs")
                submissionChart(req,res, req.body );
            else if( req.body.studentData.key == "nfiv")
                feedbackViewedChart(req,res,req.body);
            else if( req.body.studentData.key == 'nerrs')
                feedbackItemChart(req,res,req.body);
            else if( req.body.studentData.key == 'sass')
                studentSelfAssessmentChart(req,res,req.body);
            else
                res.end();
        }
        else {
            req.flash('errorMessage', "Invalid date information");
            res.redirect('/studentModel');
        }
    });
}
