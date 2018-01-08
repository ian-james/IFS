var path = require('path');
var viewPath = path.join( __dirname + "/");
var _ = require('lodash');

var moment = require('moment');
var studentModel = require(__components + "StudentModel/studentModelDB");
var socialModel = require(__components + "SocialModel/socialStatsDB");
var chartHelpers = require( __components + "Chart/chartHelpers.js");

var event = require(__components + "InteractionEvents/buildEvent.js" );
var tracker = require(__components + "InteractionEvents/trackEvents.js" );

module.exports = function(app, iosocket) {

    var DEFAULT_DATE_FORMAT = "YYYY-MM-DD";

    function submissionChart( req,res, options ) {
        socialModel.getSubmissionsPerWeekBetweenDates(req.user.id, options.minDate, options.maxDate, function(serr,socialData) {
            studentModel.getSubmissionsPerWeekBetweenDates(req.user.id, options.minDate, options.maxDate, function(uerr,userData) {

                var options = chartHelpers.chartOptions(true,true,"Weekly Submission Rates", chartHelpers.makeScale(true,"Weeks"), chartHelpers.makeScale(true,"Submissions"));
                var groups = { 'user': userData, 'social': socialData };

                // Added weeks where submission didn't ok for either class or
                groups['user'] = chartHelpers.injectDefaultData('social', 'user', groups,0);
                groups['social'] = chartHelpers.injectDefaultData( 'user', 'social', groups,0);

                var chartData = chartHelpers.setupSeriesData(groups,options, function( labels, values) {
                    return labels[0];
                }, {
                    'user': "Student",
                    'social': "Class"
                });
                res.json(chartData);
                res.end();
            });
        });
    }

    // TODO: Generalized this function a lot of the functionality here is overlapping with chartHelpers but don't have time to rework.
    function feedbackItemChart( req,res, options ) {
        socialModel.getFeedbackPerWeekBetweenDates(req.user.id, options.minDate, options.maxDate, function(serr,socialData) {
            studentModel.getFeedbackPerWeekBetweenDates(req.user.id, options.minDate, options.maxDate, function(uerr,userData) {

                var options = chartHelpers.chartOptions(true,true,"Weekly Feedback Rates", chartHelpers.makeScale(true,"Weeks"), chartHelpers.makeScale(true,"Feedback Items"));

                // Get Labels;
                var mySet = new Set();
                for(var i = 0; i < userData.length; i++ )
                    mySet.add(userData[i].labels);

                for(var i = 0; i < socialData.length; i++ )
                    mySet.add(socialData[i].labels);

                // Differentiage between social and student runTypes for series information
                _.each(socialData, obj => obj['runType'] = "s" + obj['runType']);

                // Merge Data
                var data = userData.concat(socialData);
                groups = _.groupBy(data,'runType');


                // Add default data for each group
                // For each gropu add all default label values
                var series = _.keys(groups);
                for(var i = 0; i < series.length; i++) {
                    var group = groups[ series[i] ];
                    for( var setItem of mySet.values() ) {
                        if(!_.find(group,{'labels':setItem})){
                            var defaultObject = { 'runType': series[i], 'value':0, 'labels': setItem };
                            groups[ series[i] ].push( defaultObject);
                        }
                    }
                    groups[ series[i] ] = _.orderBy(groups[ series[i] ],['labels']);
                }

                // Setup legend mapping
                var seriesMap = { 'visual': 'Student Visual', 'programming': "Student Programming", 'writing': "Student Writing", 
                                  'svisual': 'Class Visual', 'sprogramming': "Class Programming", "swriting": "Class Writing"};

                // Make chart
                var chartData = chartHelpers.setupSeriesData(groups, options, function( labels, values) {
                    return labels[0];
                }, seriesMap);

                res.json(chartData);
                res.end();
            });
        });
    }

    
    function feedbackViewedChart( req,res, options ) {
        socialModel.getFeedbackViewedPerWeekBetweenDates(req.user.id, options.minDate, options.maxDate, function(serr,socialData) {
            studentModel.getFeedbackViewedPerWeekBetweenDates(req.user.id, options.minDate, options.maxDate, function(uerr,userData) {

                var options = chartHelpers.chartOptions(true,true,"Weekly Feedback Viewed Rates", chartHelpers.makeScale(true,"Weeks"), chartHelpers.makeScale(true,"Feedback Viewed"));
                var groups = { 'user': userData, 'social': socialData };

                // Added weeks where submission didn't ok for either class or
                groups['user'] = chartHelpers.injectDefaultData('social', 'user', groups,0);
                groups['social'] = chartHelpers.injectDefaultData( 'user', 'social', groups,0);

                var chartData = chartHelpers.setupSeriesData(groups,options, function( labels, values) {
                    return labels[0];
                }, {
                    'user': "Student",
                    'social': "Class"
                });
                res.json(chartData);
                res.end();
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

            if( req.body.studentData ) {
                tracker.trackEvent( iosocket, event.changeEvent(req.user.sessionId, req.user.id, "socialModelData", req.body.studentData ));
            }

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
            res.redirect('/studentModel');
        }
    });
}
