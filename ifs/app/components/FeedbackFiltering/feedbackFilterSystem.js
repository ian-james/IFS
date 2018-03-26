var path = require("path");
var fs = require("fs");
var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');
var async = require('async');

/**
 * Sorts feedback items, by file, type, and organizes them
 * Writes all feedback to individual files and an all file.
 * @param  {[type]}   fileInfo [description]
 * @param  {[type]}   fullData [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
/*
function organizeResults( fileInfo, fullData, callback ) {
    var obj = {};

    // Create File objects for each file
    obj['files'] = fileInfo;

    // Sort by properties
    var sortedFeedbackItems = _.sortBy( fullData, ['filename','lineNum', 'wordNum','toolName'] );

    // Separate the feedback items for writing to a file and passing back
    var fdbTypes = _.groupBy(sortedFeedbackItems, 'runType');

    var dest = fileInfo[0].destination;

    obj['feedback'] = fdbTypes;
    obj['feedbackFiles'] = {};

    Logger.info("Write feedback Files");
    async.eachOf( fdbTypes, function(value, key, acallback) {

        var filename = key + "FeedbackFile.json";
        var file = path.join(dest,filename);
        obj['feedbackFiles'][key] = file;
        Logger.info("Writing FeedbackFile:", file);
        fs.writeFile( file, JSON.stringify(obj), (err) => {
            if(err) {
                Logger.error( "Failed to write ", file );
                return acallback(err);
            }
            acallback();
        });
    }, function(err){
        if(err)
            Logger.error("Failed to write feedback files");

        var allFeedbackFile =  path.join( dest , "allFeedbackFile.json");
        obj['allFeedbackFile'] = allFeedbackFile;
        fs.writeFile( allFeedbackFile, JSON.stringify(obj), (err) => {
            callback(obj);
            Logger.info("Finish Write feedback Files");
        });
    });
}
*/

*
 * Sets up position information for feedback items.
 * Uses regular expressions, the tool and feedback positional info.
 * @param  {[type]} file          [description]
 * @param  {[type]} selectedTool  [description]
 * @param  {[type]} feedbackItems [description]
 * @return {[type]}               [description]
 
function setupFilePositionInformation(file, selectedTool, feedbackItems) {
    var fileParser = new FileParser();
    fileParser.setupContent( file.content );
    fileParser.tokenize();

    // Setup positionsal information for all
    for( var i = 0; i < feedbackItems.length; i++ ) {
        var feedbackItem = feedbackItems[i];
        if( filesMatch(file.originalname, feedbackItem.filename)  &&  toolsMatch(feedbackItem.toolName,selectedTool) ) {
            if( !feedbackItem.filename || !feedbackItem.lineNum ) {
                // TODO: This should be handed a generic or global error system.
                continue;
            }

            // Try to fill out positional information first.
            if( !feedbackItem.charNum ) {
                feedbackItem.charNum = fileParser.getCharNumFromLineNumCharPos(feedbackItem);
            }

            // Without a target you have to use the line or a range
            if( !feedbackItem.target ) {
                if( feedbackItem.hlBeginChar ) {
                    // Section to highlight
                    feedbackItem.target = fileParser.getRange( feedbackItem );
                }
                else if( feedbackItem.charPos ) {
                    // You can get a target better than the line.
                    feedbackItem.target = fileParser.getLineSection( feedbackItem );
                }
                if(!feedbackItem.target) {
                    feedbackItem.target = fileParser.getLine(feedbackItem,false);
                }
            }
        }
    }
}

//module.exports.organizeResults = organizeResults;
