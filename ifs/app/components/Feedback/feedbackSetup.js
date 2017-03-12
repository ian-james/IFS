var fs = require('fs');
var fbHighlighter = require('./feedbackHighlighter');
var buttonMaker = require('./createTextButton');
var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

/* This function loads the selected tool, loads file content and requests highlight*/
function readFeedbackFormat( feedback , options)
{
    var feedbackFormat = JSON.parse(feedback);
    console.log("ReadFeedbackFormat");

    var files = feedbackFormat.files; // Array of files
    var feedbackItems = feedbackFormat.feedback.writing;

    console.log("ReadFeedbackFormat:", feedbackItems );

    // A Unique list of tools used for UI
    var toolsUsed = _.uniqBy(feedbackItems,'toolName');
    console.log( toolsUsed );
    // Tool should always be selected unless it's defaulted too.
    var selectedTool = (options && options['tool'] || toolsUsed.length >= 1 && toolsUsed[0].toolName);
    if( selectedTool ) {
        // For each file, read in the content and mark it up for display.
        for( var i = 0; i < files.length; i++ )
        {
            var file = files[i];
            file.content = fs.readFileSync( file.filename, 'utf-8');
            file.markedUp = fbHighlighter.markupFile( file, selectedTool, feedbackItems );
        }
        return { 'files':files, 'feedbackItems': feedbackItems, 'toolsUsed':toolsUsed, 'selectedTool':selectedTool };
    }
    console.log("HERE123:", feedbackItems );
    return {'files':files, 'feedbackItems': feedbackItems, "msg":"Unable to display feedback."};
}

function readFiles( filename , options) {
    console.log(filename);
    var feedback = fs.readFileSync( filename, 'utf-8');
    return readFeedbackFormat( feedback , options );
}

module.exports.readFeedbackFormat = readFeedbackFormat;
module.exports.setupFeedback = readFiles;