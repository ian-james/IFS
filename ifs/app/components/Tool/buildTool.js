
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

// This is the external call that uses the form data,
// user selected options to create jobs for the Queue
function createJobRequests( toolFile, selectedOptions ) {

    var toolList = readToolFileList(toolFile);
    toolList.tools = removeInactiveTools(toolList.tools,selectedOptions);

    selectedOptions = removeEnabledFormData( selectedOptions );

    var toolOptions = parseFormSelection( selectedOptions );

    var res = insertOptions(toolList.tools, toolOptions);
    var jobReq =  buildJobs(res, selectedOptions.files, {prefixArg: false} );

    return jobReq;
}


// Reads JSON document and creates an array of objects with tool information and options.
// See tooList.json (these are tools avilable in the tool page)
function readToolFileList( filename ) {

    var supportedToolsFile = './tools/toolListProgramming.json';
    if( filename )
        supportedToolsFile = filename;

    var result = fs.readFileSync( supportedToolsFile, 'utf-8');
    var jsonObj = JSON.parse(result);
    return jsonObj;
}


// This function parses the form data from /tool into separate parameters for
// tool object. ***Note data remains in the received form but gets classified.
function parseFormSelection( formData ) {

    var isDone = false;
    var toolMarker = 'tool-';
    var targetTool = {};
    var progName ="";
    var option = {};
    var tool = undefined;

    var toolOptions = { 'files': formData['files'], 'tools':[] };

    _.forEach( formData, function(value, key ) {

        if( key == "submit" || key == "time") {
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
                if (r['value'])
                    tool.options.push(r);
            }
        }
    });
    return toolOptions;
}


// This functions calls either basicParse or custom command defined in tooList
// Custom commands are called in t.parseCmd in toolList
// It lets you decide how to turn form data into command line parameter
// for the program call.
// Note: JS eval seems to play funny with nodemon.
function insertOptions( toolList, toolOptions) {

    _.forEach( toolList, function(t){
        var targetToolOptions = getJsonTool( toolOptions.tools, t.progName );

        if( targetToolOptions )
        {
            var cmd = t.parseCmd || "basicParse";
            var result = "";
            try{
                result = eval(cmd)(t,targetToolOptions);
            }
            catch(err){
                Logger.error("Failed to parse form options  with function ", cmd );
            }
        }

    });
    return toolList;
}

/**
 * Takes form data and the tool list and remove tool information for disabled tools.
 */
function removeInactiveTools(toolList, formOptions) {

    var enables = _.pickBy(formOptions, function(value,key) {
        return _.startsWith(key,"enabled-");
    });

    var activeTools = _.filter(toolList, function(tool) {
        var str = "enabled-" + tool.displayName;
        return _.hasIn(enables,str);
    });

    return activeTools;
}

/**
 * Removes enabled checkbox information from form data 
 * @param  {[type]} formOptions [description]
 * @return {[type]}             [description]
 */
function removeEnabledFormData( formOptions ) {

    var enables = _.pickBy(formOptions, function(key,value) {
        return _.startsWith(key,"enabled-") == false;
    });

    return enables;
}


// Reduces the side of the object from the full job to a smaller version.
// Also creates a run command for the job.

function buildJobs( fullJobs, files, options ) {

    // Create an array of jobs with just the above mentioned keys, most important for passing.
    // Create a new property of the job that is the complete run call
    // TODO: Might eventually change this based on cmdType restType and cmdType
    var keys = [ 'displayName', 'progName', 'runType', 'defaultArg', 'fileArgs', 'options', "cmdToolName"];

    var halfJobs = _.map( fullJobs, obj => _.pick(obj, keys) );

    // BUild all the jobs minus files at the end
    var jobs = _.map( halfJobs, obj => {
        obj['runCmd'] = createToolProgramCall(obj,options);
        return obj;
    });

    //This assumes that each files should be applied to each job.
    // If this becomes untrue, we will have to adjust.
    var filenames = _.map(files, 'filename' );
    var jobsPerFile = []
    for( var i = 0; i < filenames.length;i++)
    {
            for(var y = 0; y < jobs.length;y++)
            {   
                var j = _.clone( jobs[y], true );
                j['runCmd'] += (" " + filenames[i]);
                jobsPerFile.push(j);
            }
    }

    return jobsPerFile;
}


// This function takes the program name, the default parameters and user specified ones and creates
// A command line call.
function createToolProgramCall ( toolListItem, options )
{
    var call = toolListItem.progName;
    var args = [ call, toolListItem.defaultArg ];

    _.forEach( toolListItem.options, function(o) {
        if( options  && options.prefixArg ) {
            args.push( o.arg );
        }
        args.push( o.params );
    });

    args.push(toolListItem.fileArgs);
    
    var result = _.join( args, " ");
    return result;
}

// User options are already for the appropriate tool
// This handles converting checkbox and other input types
// into appropriate command line parameters
// ex) checkbox on means -option while off would be blank
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


function writeToolList( files, obj )
{
    // Get upload directory
    var uploadDir = path.dirname( obj.files[0] );

    var filename = "jobRequests.json";
    var file = path.join(uploadDir,filename);
    Logger.info("Writing job requests file:", file);
    fs.writeFileSync( file , JSON.stringify(obj), 'utf-8');
    return file;
}


// Exports below
module.exports.createJobRequests = createJobRequests;
