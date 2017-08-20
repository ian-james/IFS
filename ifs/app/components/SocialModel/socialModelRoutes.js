var path = require('path');
var viewPath = path.join( __dirname + "/");
var _ = require('lodash');

var moment = require('moment');
var studentModel = require(__components + "StudentModel/studentModelDB");
var socialModel = require(__components + "SocialModel/socialStatsDB");
var chartHelpers = require( __components + "Chart/chartHelpers.js");

module.exports = function(app, iosocket) {

    var DEFAULT_DATE_FORMAT = "YYYY-MM-DD";

    function submissionChart( req,res, options ) {
        socialModel.getSubmissionsPerWeekBetweenDates(req.user.id, options.minDate, options.maxDate, function(serr,socialData) {
            studentModel.getSubmissionsPerWeekBetweenDates(req.user.id, options.minDate, options.maxDate, function(uerr,userData) {

                console.log("**************************************************** START");
                console.log(socialData);
                console.log("**************************************************** START2");
                console.log(userData);
                console.log("**************************************************** END");
                
                var options = chartHelpers.chartOptions(true,true,"Weekly Submission Rates", chartHelpers.makeScale(true,"Weeks"), chartHelpers.makeScale(true,"Submissions"));
                var groups = { 'user': userData, 'social': socialData };

                console.log("LOGGGING GR PRE", groups);

                // Added weeks where submission didn't ok for either class or
                groups['user'] = chartHelpers.injectDefaultData('social', 'user', groups,0);
                console.log("LOGGGING GR 1st PASS", groups);
                groups['social'] = chartHelpers.injectDefaultData( 'user', 'social', groups,0);

                console.log("LOGGGING GR POST\n\n", groups);

                var chartData = chartHelpers.setupSeriesData(groups,options, function( labels, values) {
                    return labels[0];
                }, {
                    'user': "Student",
                    'social': "Class"
                });
                res.json(chartData);
                res.send();
            });
        });
    }



     /************************************************** ROUTES *********************************************************************/
    app.get('/socialModel', function(req,res) {
        res.render( viewPath + "socialModel", { "title":"Social Learner Model" } );
    });

    app.get('/socialModel/data', function(req,res) {
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
    app.post('/socialModel/data', function(req, res) {
        if( req.body.studentData && chartHelpers.validateDate(req.body.minDate) && chartHelpers.validateDate(req.body.maxDate) && moment(req.body.maxDate).isAfter(req.body.minDate)) {
            if( req.body.studentData.key == "nsubs")
                submissionChart(req,res, req.body );
            else if( req.body.studentData.key == "nfiv")
                feedbackViewedChart(req,res,req.body);
            else if( req.body.studentData.key == 'nerrs')
                feedbackItemChart(req,res,req.body);
            else
                res.end();
        }
        else {
            req.flash('errorMessage', "Invalid date information");
            res.redirect("/socialModel");
        }
    });
}
