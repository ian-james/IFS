var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");
var _ = require('lodash');
var async = require('async');
var chart = require('chart.js');

var moment = require('moment');

var studentModel = require(__components + "StudentModel/studentModelDB");
/*
var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");

var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var dbHelpers = require(__components + "Databases/dbHelpers");

var studentProfile = require(__components + "StudentProfile/studentProfileDB");
var upcomingEvents = require(__components + "StudentProfile/upcomingEventsDB");
var studentSkill = require(__components + "StudentProfile/studentSkillDB");
*/

module.exports = function(app, iosocket) {

    var DEFAULT_DATE_FORMAT = "YYYY-MM-DD"

    /**
     * Validate date in a specific format.
     * @param  {[type]} value      [description]
     * @param  {String} dateFormat [description]
     * @return {[type]}            [description]
     */
    function validateDate( value , dateFormat = "YYYY-MM-DD") {
        return moment( moment(value).format(dateFormat), dateFormat, true).isValid();
    }
    /**
     * Make a chart formated object
     * @param  {[type]} labels [description]
     * @param  {[type]} data   [description]
     * @param  {Array}  series [description]
     * @return {[type]}        [description]
     */
    function makeChart( labels, data, series = [], options = {} ) {
        return {
            labels: labels,
            data: data,
            series: series,
            options: options
        };
    }

    /**
     * Add Legend to chart options
     * @param {[type]}  option        [description]
     * @param {Boolean} displayLegend [description]
     */
    function addLegend(option, displayLegend = false ) {
        option['legend'] = {display:displayLegend};
    }

    /**
     * Add Title options to chart
     * @param {[type]}  option       [description]
     * @param {Boolean} displayTitle [description]
     * @param {String}  titleText    [description]
     */
    function addTitle( option,  displayTitle = false, titleText = "" ) {
        option['title'] = {
            display: displayTitle,
            text: titleText
        };
    }

    /**
     * [addElements description]
     */
    function addElements( option ) {
        option['elements'] = {
            line: {
                tension: 0
            }
        };
    }

    /**
     * Makes a single scale used in x or y axis.
     * @param  {[type]} display [description]
     * @param  {[type]} label   [description]
     * @return {[type]}         [description]
     */
    function makeScale( display, label) {
        return { scaleLabel: {
            display: display,
            labelString: label
        }};
    }

    /**
     * Add Scales add x and y axis values only if both exist.
     *   Note: chart has functionality for multiple x-y values we only add a single vlaue.
     * @param {[type]} option [description]
     * @param {[type]} xa     [description]
     * @param {[type]} ya     [description]
     */
    function addScales(option, xa, ya) {
        option['scales'] = {
            yAxes: [ya],
            xAxes: [xa]
        }
    }

    /**
     * Create a chart options object in most common format needed.
     * @param  {Boolean} displayLegend [description]
     * @param  {Boolean} displayTitle  [description]
     * @param  {String}  titleText     [description]
     * @param  {[type]}  xaxis         [description]
     * @param  {[type]}  yaxis         [description]
     * @return {[type]}                [description]
     */
    function chartOptions( displayLegend = false, displayTitle = false, titleText = "", xaxis = null, yaxis = null, setTension = false) {
        var options = {};
        addLegend(options,displayLegend);
        addTitle(options,displayTitle,titleText);

        if( xaxis && yaxis)
            addScales(options,xaxis,yaxis);

        if(setTension)
            addElements(options);

        return options;
    }

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
                var options = chartOptions(false,true,"Session Submissions",makeScale(true,"Session Date"), makeScale(true,"Submissions"));
                var chartData = makeChart(sessionDates,values,[], options);
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
                var options = chartOptions(true,true,"Feedback Items Per Submission",makeScale(true,"Submission Number"), makeScale(true,"Feedback Items"));
                var chartData = setupSeriesData(groups, options,function( labels, values) {

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
     * Setups multiple arrays of data (series) for pre-defined groups. Groups must contain labels and values keys.
     * Unless overrideLabe is set to true
     * 
     * @param  {[type]}  groupedData   [description]
     * @param  {Boolean} overrideLabel Used to override the label to a 0 to k format.
     * @return {[type]}                [description]
     */
    function setupSeriesData( groupedData, options, overrideLabelFunc  = null, seriesMap = null ){
        var datas = [];
        var labels = [];
        var series = _.keys(groupedData);
        
        for(var i = 0; i < series.length; i++) {
            var data = groupedData[series[i]];
            var label = _.map(data,"labels");
            var value = _.map(data, "value");
            datas.push(value);
            labels.push(label);
        }

        if(seriesMap)
            series = _.map(series, obj => _.get(seriesMap,obj,obj));

        if(overrideLabelFunc)
            labels = overrideLabelFunc( labels, datas );

        return makeChart(labels, datas, series, options );
    }


    /**
     * This function evens out the number of data entry points between the groups. Ie adds default values to match row sizes.
     * Since Feedback must first be viewed in short form before detailed view the sessions.
     * I'm extending the viewedMore or DetailedView information so that it properly aligns with the submisison data from quick
     *
     * Reason: ChartJS wants equal length arrays (AFAIK)
     *  Sadly arrays  with x-axis information such as [1 2, 3, 4 ] and [1,4] will not have 2 data points at 1 and 4 like you might expect
     *  but push them into the first and 2nd spots from the array position. This means the 2nd array must become [1, 0, 0, 4] to be a true represetnation.
     * @param  {[type]} feedbackGroups [description]
     * @return {[type]}                [description]
     */
    function injectDefaultData(field1, field2, feedbackGroups, defaultValue = 0) {

        var viewed = feedbackGroups[field1];
        var viewedMore = feedbackGroups[field2];

        for( var i = 0; i < viewed.length;i++ ) {
            var v = viewed[i];
            var res = _.find(viewedMore,{'labels':v.labels});
            if(!res){
                viewedMore.push( { labels: v.labels, series: field2, value: defaultValue } );
            }
        }
        viewedMore = _.orderBy(viewedMore,['labels']);
        return viewedMore;
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
                groups['viewedMore'] = injectDefaultData('viewed', 'viewedMore', groups,0);
                groups['viewed'] = injectDefaultData('viewedMore', 'viewed',groups,1);
                
                var options = chartOptions(true,true,"Viewed Feedback Items",makeScale(true,"Session with Feedback View"), makeScale(true,"Times Viewed"));
                var chartData = setupSeriesData(groups,options, function( labels, values) {
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
        if( req.body.studentData && validateDate(req.body.minDate) && validateDate(req.body.maxDate) && moment(req.body.maxDate).isAfter(req.body.minDate)) {
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
            res.redirect("/studentModel");
        }
    });
}
