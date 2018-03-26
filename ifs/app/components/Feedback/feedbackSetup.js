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
        options = options || {'groups': ["c", "cpp", "cc", "cxx", "h", "hpp"] };

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


/* This function loads the selected tool, loads file content and requests highlight */
function readFeedbackFormat( feedback , options) {

    try {
        var feedbackFormat = JSON.parse(feedback);

        var feedbackItems = feedbackFormat.feedback;
        var files = feedbackFormat.files;

        // setup Project and organize.
        if(files && files.length > 0 && fs.lstatSync(files[0].filename).isDirectory()) {
            var r = loadFiles(files[0].filename);
            if( r.length > 0 ) {
                files = _.sortBy(r, ['originalname']);
            }
        }
        else
            files = _.sortBy(files, ['filename']);

        // A Unique list of tools used for UI
        var toolsUsed = _.uniq(_.map(feedbackItems,'toolName'));

        // Suggestions are stringified json, convert back to array.
        for(var i = 0; i < feedbackItems.length; i++){
            feedbackItems[i]['suggestions'] = JSON.parse(feedbackItems[i]['suggestions']);
        }

        // Tool should always be selected unless it's defaulted too.
        var toolIsSelected = ( options && options['tool'] || toolsUsed.length >= 1);
        var selectedTool =  ( options && options['tool'] ) ?  options['tool'] : "All"
        // For each file, read in the content and mark it up for display.
        for( var i = 0; i < files.length; i++ )
        {
            var file = files[i];
            file.content = he.encode(fs.readFileSync(file.filename, 'utf-8'), true);

            //TODO: Positional setup information should be moved to the feedback filtering and organization
            // This decopules the task of highlights and positioning.
            if( toolIsSelected ) {
                setupFilePositionInformation(file, selectedTool,feedbackItems);
                file.markedUp = fbHighlighter.markupFile( file, selectedTool, feedbackItems );
            }
            else
                file.markedUp = file.content;
        }

        var result =  { 'files':files, 'feedbackItems': feedbackItems, 'toolsUsed':toolsUsed, 'selectedTool':selectedTool };
        if(selectedTool){
            var i =  selectedTool == "All" ? 0 : _.findIndex(feedbackItems,['toolName',selectedTool]);
            if( i >= 0 && feedbackItems.length > i)
                result['toolType'] = feedbackItems[i]['runType'];
        }
        return result;
    }
    catch( e ) {
        Logger.error(e);
    }

    // Error return message.
    return { "err": "Unable to process files, no feedback could be provided."};

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

        if( filesMatch(file.originalname, feedbackItem.filename) && toolsMatch(feedbackItem.toolName,selectedTool) ) {
            if( !feedbackItem.filename || !feedbackItem.lineNum ) {
                // TODO: This should be handed a generic or global error system.
                continue;
            }
            console.log( feedbackItem.target);

            if (!feedbackItem.target) {
                console.log(feedbackItem);
                // Try to fill out positional information first.
                if( !feedbackItem.charNum ) {
                    feedbackItem.charNum = fileParser.getCharNumFromLineNumCharPos(feedbackItem);
                }

                // Without a target you have to use the line or a range
                if( !feedbackItem.target ) {
                    // if we are marking up a programming file, then only get the line
                    if (feedbackItem.runType == "programming") {
                        feedbackItem.target = fileParser.getLine(feedbackItem, false);
                    }
                    else if( feedbackItem.hlBeginChar ) {

                        // Section to highlight
                        feedbackItem.target = fileParser.getRange( feedbackItem );
                    }
                    else if( feedbackItem.charPos ) {
                        // You can get a target better than the line.
                        feedbackItem.target = fileParser.getLineSection( feedbackItem );
                    }
                    else {
                        feedbackItem.target = fileParser.getLine(feedbackItem,false);
                    }
                }
            }
            console.log("FOUND TARGET", feedbackItem.target);
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

function toolsMatch( toolName, selectedToolName ) {
    return ( selectedToolName == "All" || toolName == selectedToolName );
}

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
module.exports.readFileAndSetupFeedback = readFiles;
module.exports.setupFeedbackStats = setupFeedbackStats;
module.exports.setupVisualFeedback = setupVisualFeedback;
