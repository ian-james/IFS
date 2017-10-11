var moment = require('moment');
var _ = require('lodash');

module.exports = {
     /**
     * Validate date in a specific format.
     * @param  {[type]} value      [description]
     * @param  {String} dateFormat [description]
     * @return {[type]}            [description]
     */
    validateDate : function( value , dateFormat = "YYYY-MM-DD") {
        return moment( moment(value).format(dateFormat), dateFormat, true).isValid();
    },
    /**
     * Make a chart formated object
     * @param  {[type]} labels [description]
     * @param  {[type]} data   [description]
     * @param  {Array}  series [description]
     * @return {[type]}        [description]
     */
    makeChart : function( labels, data, series = [], options = {} ) {
        return {
            labels: labels,
            data: data,
            series: series,
            options: options
        };
    },

    /**
     * Add Legend to chart options
     * @param {[type]}  option        [description]
     * @param {Boolean} displayLegend [description]
     */
    addLegend : function(option, displayLegend = false ) {
        option['legend'] = {display:displayLegend};
    },

    /**
     * Add Title options to chart
     * @param {[type]}  option       [description]
     * @param {Boolean} displayTitle [description]
     * @param {String}  titleText    [description]
     */
    addTitle : function( option,  displayTitle = false, titleText = "" ) {
        option['title'] = {
            display: displayTitle,
            text: titleText
        };
    },

    /**
     * [addElements description]
     */
    addElements : function( option ) {
        option['elements'] = {
            line: {
                tension: 0
            }
        };
    },

    /**
     * Makes a single scale used in x or y axis.
     * @param  {[type]} display [description]
     * @param  {[type]} label   [description]
     * @return {[type]}         [description]
     */
    makeScale : function( display, label) {
        return { scaleLabel: {
            display: display,
            labelString: label
        }};
    },

    /**
     * Add Scales add x and y axis values only if both exist.
     *   Note: chart has functionality for multiple x-y values we only add a single vlaue.
     * @param {[type]} option [description]
     * @param {[type]} xa     [description]
     * @param {[type]} ya     [description]
     */
    addScales : function(option, xa, ya) {
        option['scales'] = {
            yAxes: [ya],
            xAxes: [xa]
        }
    },

    /**
     * Create a chart options object in most common format needed.
     * @param  {Boolean} displayLegend [description]
     * @param  {Boolean} displayTitle  [description]
     * @param  {String}  titleText     [description]
     * @param  {[type]}  xaxis         [description]
     * @param  {[type]}  yaxis         [description]
     * @return {[type]}                [description]
     */
    chartOptions : function( displayLegend = false, displayTitle = false, titleText = "", xaxis = null, yaxis = null, setTension = false) {
        var options = {};
        this.addLegend(options,displayLegend);
        this.addTitle(options,displayTitle,titleText);

        if( xaxis && yaxis)
            this.addScales(options,xaxis,yaxis);

        if(setTension)
            this.addElements(options);

        return options;
    },

    //*** MORE specific Helpers **//
     /**
     * Setups multiple arrays of data (series) for pre-defined groups. Groups must contain labels and values keys.
     * Unless overrideLabe is set to true
     * 
     * @param  {[type]}  groupedData   [description]
     * @param  {Boolean} overrideLabel Used to override the label to a 0 to k format.
     * @return {[type]}                [description]
     */
    setupSeriesData : function( groupedData, options, overrideLabelFunc  = null, seriesMap = null ){
        var datas = [];
        var labels = [];
        var series = _.keys(groupedData);
        
        for(var i = 0; i < series.length; i++) {
            var data = groupedData[series[i]];
            var label = _.map(data, _.get(options,"labelKey","labels"));
            var value = _.map(data, _.get(options,"valueKey","value"));
            datas.push(value);
            labels.push(label);
        }

        if(seriesMap)
            series = _.map(series, obj => _.get(seriesMap,obj,obj));

        if(overrideLabelFunc)
            labels = overrideLabelFunc( labels, datas );

        return this.makeChart(labels, datas, series, options );
    },


    /**
     * This function evens out the number of data entry points between the groups. Ie adds default values to match row sizes.
     * Since Feedback must first be viewed in short form before detailed view the sessions.
     * I'm extending the viewedMore or DetailedView information so that it properly aligns with the submisison data from quick
     *
     * Reason: ChartJS wants equal length arrays (AFAIK)
     *  Sadly arrays  with x-axis information such as [1 2, 3, 4 ] and [1,4] will not have 2 data points at 1 and 4 like you might expect
     *  but push them into the first and 2nd spots from the array position. This means the 2nd array must become [1, 0, 0, 4] to be a true represetnation.
     * 
     * @param  {[type]} feedbackGroups [description]
     * @return {[type]}                [description]
     */
    injectDefaultData : function(field1, field2, feedbackGroups, defaultValue = 0) {

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
}