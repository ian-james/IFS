
/* 
    Passing a JSON object that represents a tool with options
    
    ***
    Required members are (please update as this changes)
    progName-> name of the command to run this program.

    Optional:
    options: can be a list of arguments or none

    Return: A blank object if error
            Else: returns an object wtih combination of arguments are program name.
*/
var fs = require('fs');
var _ = require('lodash');

const progName = "progName";
const options = "options";
const runCmd = "runCmd";


// Searches the JSON tool list to find a specific tool and return it */
function getJsonTool( toolsJson, targetTool ){
    var tool = _.find(toolsJson, function(t) {
        return  t.progName == targetTool;
    });
    return tool;
}

// Reads JSON document and creates an array of objects with tool information and options.
// See tooList.json

function readToolFileList() {

    var supportedToolsFile = './tools/toolList.json';
    var result = fs.readFileSync( supportedToolsFile, 'utf-8');
    var jsonObj = JSON.parse(result);
    return jsonObj;
}

/** This function takes form data from the tool page and separates it. There is a large assumption that options
    are obtained in a regular order. IE hidden input passes the progName and then all sequential options are related 
    to that tool until the next tool hidden input.
    Ex)  tool-hunspell 
         input1 (options for hunspell)
         input2 (option for hunspell)
         tool-nextTool

    Return: Basic job descriptions that still require processing but that contain the user's selected preferences for this run.
    Tool DisplayName, program name (which is how you run from command line), and options.

    Options must be of the form
    'key': theOptionName in toolList,
    'value' : the user selected value for that option.
*/

function parseToolForm ( selectedOptions ) {

    var tools= [];
    var obj = null;
    var toolMarker = 'tool-';
    var isDone = false;
    _.forOwn( selectedOptions, function(value, key ){
      
        if(!isDone)
        {
            // Separate the tools form data here
            if( _.startsWith(key, toolMarker) ) {

                if(obj != null) {
                    tools.push(obj);
                }

                var progName = key.substr( toolMarker.length );
                var displayName = value;
                obj = buildTool( displayName, progName );
            }
            else if( key == "submit") {
                if(obj != null )
                    tools.push(obj);
                isDone = true;
            }
            else if(obj != null) {
                // Assumption being that anything after a tool is part of it's options hierachy.
                obj.options.push({key,value});
            }
        }
    });
}

function buildJobRequests( selectedOptions ){

}

// This function is a wrapper for the full process of adding user selected options to create job requests for
//   different tools

function insertOptions( selectedOptions ){
    var toolList = readToolFileList();
    var userSelectedTools = insertOptionsJson( toolList.tools, selectedOptions );
    displayTools(userSelectedTools);
    return buildJobs( userSelectedTools, selectedOptions.files );
}

//  This function takes the json tools and modifies the options for the command line parameters.
//  TODO: This function will need to be more dynamic in the future to handle more cases.
//  
function insertOptionsJson ( toolsJson, selectedOptions ) {

    var tools= [];
    var toolMarker = 'tool-';
    var isDone = false;
    var progName = "";
    var displayName = "";
    var targetTool= null;

    _.forOwn( selectedOptions, function(value, key ){
      
        if(!isDone)
        {
            // Separate the tools form data here
            if( key == "submit") {
                isDone = true;
            }
            else if( _.startsWith(key, toolMarker) ) {
                progName = key.substr( toolMarker.length );
                displayName = value;

                targetTool =  _.find( toolsJson, function(t) {
                    return t.progName == progName;
                });
            }
            else if(targetTool != null) {
                
                var targetOption = _.find( targetTool.options, function(o) {
                    return o.name == key;
                });

                if(targetOption) {
                    //TODO: This will need to transform form input variables into something more useful.
                    // Perhaps we even do conversion at a higher level.
                    // parameters for example -r on should be translated to -r and -r off should be blank
                    if( !(value == "on" || value == 'off') ) {
                        var opt = { params: value }
                        _.extend(targetOption, opt);
                    }

                    var fileOpts = selectedOptions.files;
                    _.extend(targetOption, fileOpts );
                }
            }
        }
    });

    return toolsJson;
}

// This function takes the program name, the default parameters and user specified ones and creates 
// A command line call.
function createToolProgramCall ( toolListItem, files )
{
    var call = toolListItem.progName;
    var args = [ call, toolListItem.defaultArg ];

    _.forEach( toolListItem.options, function(o) {
        args.push( o.arg );
        args.push( o.params );
    });

    
    console.log("Start");
    var filenames = _.map(files, 'filename' );
    console.log(filenames);
    console.log( args );
    var fullPath = _.union(args, filenames );
    var result = _.join( fullPath, " ");

    console.log("CreateToolProgramCall->", result);
    return result;
}

// Reduces the side of the object from the full job to a smaller version.
// Also creates a run command for the job.

function buildJobs( fullJobs, files ) {

    // Create an array of jobs with just the above mentioned keys, most important for passing.
    // Create a new property of the job that is the complete run call
    // TODO: Might eventually change this based on cmdType restType and cmdType
    var keys = [ 'displayName', 'progName', 'runType', 'defaultArg', 'options'];
 
    var halfJobs = _.map( fullJobs, obj => _.pick(obj, keys) );

    var jobs = _.map( halfJobs, obj => {
        obj['runCmd'] = createToolProgramCall(obj,files);
        return obj;
    });
    return jobs;
}

//Display key elements of a single tool object.
// TODO: update this used logger.

function displayTool( tool ) {

    var keys = [ 'displayName', 'progName', 'runType', 'defaultArg'];
    var t = _.pick(tool, keys);
    //console.log("Display Small Tool information");
    //console.log(t);
    _.forEach( tool.options, function(o){
        //console.log("Next Option");
        //console.log("\t",o.displayName);
        //console.log("\t",o.name);
        //console.log("\tARG:", o.arg);
        //console.log("\tPARAM:", o.params);
    });
}

// Generic all for all tools to be displayed.
function displayTools( tools ) {
    _.forEach( tools, displayTool );
}


// Exports below
module.exports.insertOptions = insertOptions