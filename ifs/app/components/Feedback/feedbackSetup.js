var fs = require('fs');
var _ = require('lodash');
var he = require('he');
var path = require('path');
var async = require('async');

var fbHighlighter = require('./feedbackHighlighter');
var Logger = require( __configs + "loggingConfig");

var Helpers = require( __components+ "FileUpload/fileUploadHelpers");

const allowFileTypes = require( __configs + "acceptableFileTypes.json" );
const allowMimeTypes= require( __configs + "acceptableMimeTypes.json" );
const appDefaults = require( __configs + "appDefaults.json" );

const helpers = require( __configs + "configHelpers.js" );


var ProgrammingParser = require('./parsers/programmingParser').ProgrammingParser;
var WritingParser = require('./parsers/writingParser').WritingParser;

/* This function is used when given a directory as the file path.
   It assumes this is a programming project folder and will create File Objects
*/
function loadFiles( directory, options ) {
    if( fs.lstatSync(directory).isDirectory() ) {
        options = options || {'groups': allowFileTypes.ProgrammingSrc };

        var files = Helpers.findFilesSync(directory);
        var fileGroups = _.groupBy(files, Helpers.getExt);

        var arr = [];
        for( var i = 0; fileGroups &&  i < options.groups.length;i++ ) {
            var files = _.get(fileGroups, options.groups[i]);
            for(var y = 0; files &&  y < files.length;y++)
                arr.push( Helpers.createFileObject(files[y]));
        }
        return arr;
    }
    return [];
}

/**
 * [sortFeedbackFiles description] - This function sorts the feedback files, it will loads feedback files if given a directory .
 * @param  {[type]} files [description]
 * @return {[type]}       [description]
 */
function sortFeedbackFiles( files ) {

    var rfiles = [];
    // setup Project and organize.
    if(files && files.length > 0 ) {
        var r = loadFiles(files[0].filename);
        if( r.length > 0 ) {
            rfiles = _.sortBy(r, ['originalname']);
            return rfiles;
        }
    }
    rfiles = _.sortBy(files, ['filename']);
    return rfiles;
}

/**
 * [getFeedbackObj This function loads/parses key information about the feedback object.
 * @param  {[type]} feedback [description]
 * @return {[type]}          [description]
 */
function getFeedbackObj( feedback ) {
    var result = {};
    try {
        result.feedbackFormat = JSON.parse(feedback);
        result.feedbackItems = result.feedbackFormat.feedback;
        result.toolType = result.feedbackFormat.runType;
        result.files = result.feedbackFormat.files;

         // Suggestions are stringified json, convert back to array.
        var countItems = result.feedbackItems.length ;
        for(var i = 0; i < result.feedbackItems.length; i++){
            result.feedbackItems[i]['suggestions'] = JSON.parse(result.feedbackItems[i]['suggestions']);
        }
    }
    catch(e) {
        Logger.error(e);
        return {};
    }
    return result;
}


/**
 * [setupFeedbackFiles description] - This function reads the feedback object, sets feedback files, and setup tools;
 * @param  {[type]} feedback [description]
 * @param  {[type]} options  [description]
 * @return {[type]}          [description]
 */
function setupFeedbackFiles( feedback, options ) {
    try {

        var feedbackObj = getFeedbackObj( feedback );
        var res = sortFeedbackFiles( feedbackObj.files );
        feedbackObj.files = res;

        // A Unique list of tools used for UI
        feedbackObj.toolsUsed = _.uniq(_.map(feedbackObj.feedbackItems,'toolName'));
        feedbackObj.selectedTool =  ( options && options['tool'] ) ?  options['tool'] : "All"
        return feedbackObj;
    }
    catch( e ) {
        Logger.error(e);
         throw new Error("Error: Unable to setup feedback files.");
    }
}

/* This function loads the selected tool, loads file content and requests highlight */
function readFeedbackFormat( feedback , options, callback ) {

    try {
        var feedbackObj = setupFeedbackFiles( feedback, options );
    }
    catch(e){
        Logger.error(e);
        callback(e);
    }

    // Tool should always be selected unless it's defaulted too.
    var toolIsSelected = ( options && options['tool'] || feedbackObj.toolsUsed.length >= 1);

    // For each file read and setup for presentation.
    async.eachOf( feedbackObj.files, function(file,index,cb){
        fs.readFile( file.filename, 'utf-8', function(err, contents ){

            file.content = contents;
            file.coded = he.encode(contents, true);
            if( toolIsSelected ) {
                setupFilePositionInformation(file, feedbackObj.selectedTool, feedbackObj.feedbackItems);
                file.markedUp = fbHighlighter.markupFile( file, feedbackObj.selectedTool, feedbackObj.feedbackItems );
            }
            else {
                file.markedUp = file.content;
            }
            cb(null,file);
        })
    },
    function(err) {
        if( err ) {
            callback(err);
        }
        else {
            var results =  { 'files': feedbackObj.files , 'feedbackItems': feedbackObj.feedbackItems, 'toolsUsed': feedbackObj.toolsUsed, 'selectedTool':feedbackObj.selectedTool };
            if(feedbackObj.selectedTool){
                   var i =  feedbackObj.selectedToolselectedTool == "All" ? 0 : _.findIndex(feedbackObj.feedbackItems,['toolName',feedbackObj.selectedTool]);
                    if( i >= 0 && feedbackObj.feedbackItems.length > i)
                    results['toolType'] = feedbackObj.feedbackItems[i]['runType'];
            }
            callback(null, results);
        }
    });
}

function setupFilePositionInformation(file, selectedTool, feedbackItems) {

    // Setup the parser for this file, content should already be loaded.
    var parser = null;
    if( feedbackItems && feedbackItems.length > 0){
        if( helpers.isProgramming( feedbackItems[0].runType) )
            parser = new ProgrammingParser();
        else
            parser = new WritingParser();

        parser.setupContent(file.content);
        parser.tokenize();
    }


    for( var i = 0; i < feedbackItems.length; i++ ) {
        var feedbackItem = feedbackItems[i];

        if( filesMatch(file.originalname, feedbackItem.filename) && toolsMatch(feedbackItem.toolName,selectedTool) ) {
            if( !feedbackItem.filename || feedbackItem.lineNum == null ) {
                // TODO: This should be handed a generic or global error system.
                continue;
            }

            if (!feedbackItem.target) {

                // Try to fill out positional information first.
                if( !feedbackItem.charNum ) {
                    feedbackItem.charNum = parser.getCharNumFromLineNumCharPos(feedbackItem);
                }

                // Different behavior if programming.
                if ( helpers.isProgramming(feedbackItem.runType)) {
                    feedbackItem.target = parser.getLine(feedbackItem, false);
                }
                else{
                    // Some tools provide highlight sections.
                    if( feedbackItem.hlBeginChar ) {
                        // Section to highlight
                        feedbackItem.target = parser.getRange( feedbackItem );
                    }
                    else if( feedbackItem.charPos ) {
                        // You can get a target better than the line.
                        feedbackItem.target = parser.getLineSection( feedbackItem );
                    }
                    else {
                        feedbackItem.target = parser.getLine( feedbackItem, false );
                    }
                }
            }
            // Set up a decoded target for Bootstrap UI Popover
            // This is probably a bad temporary fix
            if ( !feedbackItem.decodedTarget ) {
                feedbackItem.decodedTarget = he.decode(feedbackItem.target);
            }
        }
    }
}

function filesMatch( filename, feedbackFilename, usePath = false) {
    if( usePath )
        return filename == feedbackFilename;

    return path.basename(filename) == path.basename(feedbackFilename);
}

/**
 * Wrapper to check if tools name or the selected tool is all.
 * @param  {[str]} toolName         [toolname in quesiton]
 * @param  {[str]} selectedToolName [current toolname]
 * @return {[bool]}                  [If tool names match or are equal to all.]
 */
function toolsMatch( toolName, selectedToolName ) {
    return ( selectedToolName == "All" || toolName == selectedToolName );
}


/**
 * Extract the feedback stats based on the filename and stat for display.
 * If stats is empty pass back empty object, otherwise object has array.
 * @param  {[type]} visualTools [description]
 * @return {[type]}             [description]
 */

function setupFeedbackStats(feedbackStats) {

    var resStats = {};
    if(!(feedbackStats && feedbackStats.length > 0))
        return resStats;

    for(var i = 0; i< feedbackStats.length;i++) {
        if( !resStats[feedbackStats[i].filename] )
            resStats[feedbackStats[i].filename] = {};
        resStats[feedbackStats[i].filename][feedbackStats[i].name] = feedbackStats[i];
    }
    return {'feedbackStats': resStats };
}

/**
 * Converting visualTools parameter from mysqlDB to easy display format.
 * If visual tools is empty pass back empty object, otherwise object has array.
 * @param  {[type]} visualTools [description]
 * @return {[type]}             [description]
 */
function setupVisualFeedback(visualTools) {
    var res = {};
    if( visualTools && visualTools.length > 0) {
        res = [];
        for(var i = 0; i< visualTools.length;i++) {
            var name = visualTools[i].name;
            var route = visualTools[i].route;
            res.push({
                'name': name,
                'route': route
            });
        }
        return {'visualTools': res };
    }
    return res;
}

module.exports.setupFeedback = readFeedbackFormat;
module.exports.setupFeedbackStats = setupFeedbackStats;
module.exports.setupVisualFeedback = setupVisualFeedback;
