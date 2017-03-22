var path = require("path");
var fs = require("fs");
var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

/* 
    This function creates the json object for the parsing and  highlightin system.
    Basically, it needs to create two fields file.   

    Needs to take create file info, job info
    Feedback needs to include the job type per request.
*/
function organizeResults( fileInfo, fullData )
{
    var obj = {};

    // Create File objects for each file
    obj['files'] = fileInfo;
   
    // Sort by properties
    var sortedFeedbackItems = _.sortBy( fullData, ['filename','lineNum', 'wordNum','toolName'] );
    
    // Separate the feedback items for writing to a file and passing back
    var fdbTypes = _.groupBy(sortedFeedbackItems, 'runType');
    
    writeResults(obj, fdbTypes, fileInfo[0].destination );

    obj['feedback'] = fdbTypes;

    var allFeedbackFile = 'displayedFeedback.json';
    obj['allFeedbackFile'] = path.join( fileInfo[0].destination , allFeedbackFile);
    writeFeedbackToFile( fileInfo[0].destination , obj, allFeedbackFile );

    return obj;
}

/* 
    Write the different types of feedback files *
*/
function writeResults(obj, fdbTypes, uploadPath ){
    // Stores the results in separated format too.
    Logger.info("Write feedback Files");

    obj['feedbackFiles'] = {};
    _.forIn( fdbTypes, function(value,key) {

        var filename = key + "FeedbackFile.json";
        obj['feedbackFiles'][key] = path.join(uploadPath,filename);
        writeFeedbackToFile(uploadPath, value, filename);
    });

    Logger.info("Finish Write feedback Files");
}

/* 
    Write the feedback to a file.
*/
function writeFeedbackToFile(pathDir, obj, filename )
{
    // Get upload directory    
    var file = path.join(pathDir,filename);
    Logger.info("Writing FeedbackFile:", file);
    fs.writeFileSync( file, JSON.stringify(obj), 'utf-8');
    return file;
}

module.exports.organizeResults = organizeResults;
