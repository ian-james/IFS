
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

// This function parses the form data into separate tool object
// Note data remains in the received form but gets classified.
function parseFormSelection( formData ) {

    var isDone = false;
    var toolMarker = 'tool-';
    var targetTool = {};
    var progName ="";
    var option = {};
    var tool = undefined;

    var toolOptions = { 'files': formData['files'], 'tools':[] };
  
    _.forEach( formData, function(value, key ) {

        if( key == "submit") {
            if(tool) {
                toolOptions.tools.push( tool );
            }
            isDone = true;
        }

        if( !isDone ){

            if( _.startsWith(key, toolMarker) ) {

                if(tool) {
                    toolOptions.tools.push( tool );
                }

                progName = key.substr( toolMarker.length );
                tool = { 'progName': progName, 'options':[] };
            }
            else if(tool) {
                var r = {};
                r['name'] = key;
                r['value'] = value;
                tool.options.push( r );
            }
        }
    });
    return toolOptions;
}

// Reads JSON document and creates an array of objects with tool information and options.
// See tooList.json

function readToolFileList() {

    var supportedToolsFile = './tools/toolList.json';
    var result = fs.readFileSync( supportedToolsFile, 'utf-8');
    var jsonObj = JSON.parse(result);
    return jsonObj;
}

function createJobRequests( selectedOptions ) {
    var toolList = readToolFileList();

    var toolOptions = parseFormSelection( selectedOptions );
    var res = tempInsertOptions(toolList.tools, toolOptions);
    var jobReq =  buildJobs(res, selectedOptions.files, {prefixArg: false} );

    return jobReq;

}
// User options are already for the appropriate tool
//
function basicParse( toolListItem, userOptions ){

    _.forEach( toolListItem.options, function(option) {

        var userTargetTool = _.find( userOptions.options, function(o) {
            return o.name ==  option.name;
        });

        if(userTargetTool)
        {
            var value = "";
            if(option.type == "checkbox") {
                value = userTargetTool.value  == "on" ? option.arg : "";
            }
            else {
                value = option.arg + " " + userTargetTool.value;
            }

            // Update Params for tool
            var opt = { params: value }
            _.extend(option, opt);
        }
    });

    // add Files to to tool
    _.extend(toolListItem, userOptions.files);
    return toolListItem;
}

function tempInsertOptions( toolList, toolOptions) {

    _.forEach( toolList, function(t){
        var targetToolOptions = getJsonTool( toolOptions.tools, t.progName );

        if( targetToolOptions )
        {
            var cmd = t.parseCmd || "basicParse";
            var result;
            try{
                result = eval(cmd)(t,targetToolOptions);
            }
            catch(err){
                console.log("CMD->", cmd, " has errored -> ");
                console.log("tool was: ", t );
                console.log("TargetToolOption was ", targetToolOptions);
                console.log("Error-> ", err);
                console.log("******************");
            }
        }

    });
    return toolList;
}

// This function is a wrapper for the full process of adding user selected options to create job requests for
//   different tools

function insertOptions( selectedOptions ){
    return createJobRequests(selectedOptions);
}

function insertOptionsOld( selectedOptions ) {
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
function createToolProgramCall ( toolListItem, files, options )
{
    var call = toolListItem.progName;
    var args = [ call, toolListItem.defaultArg ];

    _.forEach( toolListItem.options, function(o) {
        if( options  && options.prefixArg ) {
            args.push( o.arg );
        }
        args.push( o.params );
    });
    
   
    var filenames = _.map(files, 'filename' );
    var fullPath = _.union(args, filenames );
    var result = _.join( fullPath, " ");

//    console.log("resulting call", result );

    return result;
}

// Reduces the side of the object from the full job to a smaller version.
// Also creates a run command for the job.

function buildJobs( fullJobs, files, options ) {

    // Create an array of jobs with just the above mentioned keys, most important for passing.
    // Create a new property of the job that is the complete run call
    // TODO: Might eventually change this based on cmdType restType and cmdType
    var keys = [ 'displayName', 'progName', 'runType', 'defaultArg', 'options'];
 
    var halfJobs = _.map( fullJobs, obj => _.pick(obj, keys) );

    var jobs = _.map( halfJobs, obj => {
        obj['runCmd'] = createToolProgramCall(obj,files,options);
        return obj;
    });
    return jobs;
}

//Display key elements of a single tool object.
// TODO: update this used logger.
function displayTool( tool ) {

    var keys = [ 'displayName', 'progName', 'runType', 'defaultArg'];
    var t = _.pick(tool, keys);

    console.log("Start tool display");
    console.log(t);
    _.forEach( tool.options, function(o){
        console.log("Next Option");
        console.log("\t",o.displayName);
        console.log("\t",o.name);
        console.log("\tARG:", o.arg);
        console.log("\tPARAM:", o.params);
    });
}

// Generic all for all tools to be displayed.
function displayTools( tools ) {
    _.forEach( tools, displayTool );
}


// Exports below
module.exports.createJobRequests = createJobRequests;