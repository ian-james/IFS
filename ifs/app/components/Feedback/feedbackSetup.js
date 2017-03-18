var fs = require('fs');
var fbHighlighter = require('./feedbackHighlighter');
var buttonMaker = require('./createTextButton');
var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

var Helpers = require( __components+ "FileUpload/fileUploadHelpers");

/* This function is used when given a directory as the file path.
   It assumes this is a programming project folder and will create File Objects

*/
function loadFiles( directory, options ) {

    if( fs.lstatSync(directory).isDirectory() ) {

        // TODO: How should this be handled
        options = options || {'groups': ['c','h'] }

        var files = Helpers.findFilesSync(directory);
        var fileGroups = _.groupBy(files, Helpers.getExt);

        //console.log("FileGroups2", fileGroups);
        var arr = [];
        for( var i = 0; fileGroups &&  i < options.groups.length;i++ ) {
            var files = _.get(fileGroups, options.groups[i]);
            //console.log(files);
            for(var y = 0; y < files.length;y++)
                arr.push( Helpers.createFileObject(files[y]));
        }
        return arr;
    }
    return [];
}


/* This function loads the selected tool, loads file content and requests highlight*/
function readFeedbackFormat( feedback , options)
{
    var feedbackFormat = JSON.parse(feedback);
    //console.log("ReadFeedbackFormat");

    //console.log("************************************************************* ");

    var files = feedbackFormat.files; // Array of files
    files = _.sortBy(files, ['filename']);
    var feedbackItems = feedbackFormat.feedback.writing || feedbackFormat.feedback.programming;

    if( files && fs.lstatSync(files[0].filename).isDirectory()) {
        console.log("Loading Files:");
        var r =  loadFiles(files[0].filename);
        if( r.length > 0 ) {
            files = _.sortBy(r, ['originalname']);
        }
    }
    //console.log("ReadFeedbackFormat:", feedbackItems );

    // A Unique list of tools used for UI
    var toolsUsed = _.uniqBy(feedbackItems,'toolName');
    
    // Tool should always be selected unless it's defaulted too.
    var selectedTool = (options && options['tool'] || toolsUsed.length >= 1 && toolsUsed[0].toolName);
    //console.log( "SelectedTool is ", selectedTool);
    if( selectedTool ) {
        // For each file, read in the content and mark it up for display.
        for( var i = 0; i < files.length; i++ )
        {
            //console.log("Preparing file", files[i]);
            var file = files[i];
            file.content = fs.readFileSync( file.filename, 'utf-8');
            file.markedUp = file.content;//fbHighlighter.markupFile( file, selectedTool, feedbackItems );
        }
        return { 'files':files, 'feedbackItems': feedbackItems, 'toolsUsed':toolsUsed, 'selectedTool':selectedTool };
    }
    //console.log("HERE123:", feedbackItems );
    return {'files':files, 'feedbackItems': feedbackItems, "msg":"Unable to display feedback."};
}

function readFiles( filename , options) {
    //console.log(filename);
    var feedback = fs.readFileSync( filename, 'utf-8');
    return readFeedbackFormat( feedback , options );
}

module.exports.readFeedbackFormat = readFeedbackFormat;
module.exports.setupFeedback = readFiles;