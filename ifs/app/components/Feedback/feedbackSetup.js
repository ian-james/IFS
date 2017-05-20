var fs = require('fs');
var _ = require('lodash');
var he = require('he');
var path = require('path');

var fbHighlighter = require('./feedbackHighlighter');
var Logger = require( __configs + "loggingConfig");

var Helpers = require( __components+ "FileUpload/fileUploadHelpers");

var FileParser = require('./feedbackParser').FileParser;

/* This function is used when given a directory as the file path.
   It assumes this is a programming project folder and will create File Objects
*/
function loadFiles( directory, options ) {

    if( fs.lstatSync(directory).isDirectory() ) {

        // TODO: How should this be handled
        options = options || {'groups': ['c','h'] }

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


/* This function loads the selected tool, loads file content and requests highlight*/
function readFeedbackFormat( feedback , options)
{
    var feedbackFormat = JSON.parse(feedback);

    var feedbackItems = feedbackFormat.feedback;
    var files = feedbackFormat.files;

    // setup Project and organize.
    if( files && fs.lstatSync(files[0].filename).isDirectory()) {
        var r =  loadFiles(files[0].filename);
        if( r.length > 0 ) {
            files = _.sortBy(r, ['originalname']);
        }
    }
    else
        files = _.sortBy(files, ['filename']);

    // A Unique list of tools used for UI
    var toolsUsed = _.uniqBy(feedbackItems,'toolName');

    // Suggestions are stringified json, convert back to array.
    for(var i = 0; i < feedbackItems.length;i++){
        feedbackItems[i]['suggestions'] = JSON.parse(feedbackItems[i]['suggestions']);
    }

    // Tool should always be selected unless it's defaulted too.
    var selectedTool = (options && options['tool'] || toolsUsed.length >= 1 && toolsUsed[0].toolName);
    // For each file, read in the content and mark it up for display.
    for( var i = 0; i < files.length; i++ )
    {
        var file = files[i];
        file.content = he.encode( fs.readFileSync( file.filename, 'utf-8') );

        //TODO: Positional setup information should be moved to the feedback filtering and organization
        // This decopules the task of highlights and positioning.
        if( selectedTool ) {
            setupFilePositionInformation(file, selectedTool,feedbackItems);
            file.markedUp = fbHighlighter.markupFile( file, selectedTool, feedbackItems );
        }
        else 
            file.markedUp = file.content;
    }

    var result =  { 'files':files, 'feedbackItems': feedbackItems, 'toolsUsed':toolsUsed, 'selectedTool':selectedTool };
    if(selectedTool)
        result['toolType'] = toolsUsed[0].runType;
    return result;
}

function readFiles( filename , options) {
    var feedback = fs.readFileSync( filename, 'utf-8');
    return readFeedbackFormat( feedback , options );
}

function setupFilePositionInformation(file, selectedTool, feedbackItems) {

    var fileParser = new FileParser();
    fileParser.setupContent( file.content );
    fileParser.tokenize();

    // Setup positionsal information for all
    for( var i = 0; i < feedbackItems.length; i++ ) {

        var feedbackItem = feedbackItems[i];
        if( filesMatch(file.originalname, feedbackItem.filename)  &&  toolsMatch(feedbackItem.toolName,selectedTool) )
        {
            if( !feedbackItem.filename || !feedbackItem.lineNum )
            {
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

function filesMatch( filename, feedbackFilename, usePath = false) {

    if( usePath )
        return filename == feedbackFilename;

    return path.basename(filename) == path.basename(feedbackFilename);

}

function toolsMatch( toolName, selectedToolName ) {
    return ( selectedToolName == "All" || toolName == selectedToolName );
}

module.exports.setupFeedback = readFeedbackFormat;
module.exports.readFileAndSetupFeedback = readFiles;