var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var async = require('async');

var exec = require('child_process').exec, child;

var ToolFolder = path.join(__dirname , "../..", "/app/components/Tool");
var BuildTool = path.join( ToolFolder, "buildTool.js");

var ToolLoader = require(BuildTool);

function printInformation() {
    console.log("The program runs all the of the IFS Tools listed in each tools file." +
                "You may pass in 2 paramters\n " +
                "1) A programming directory/file to test\n" +
                "2) a writing directory/file to test ");
}

var toolTypes = [{
        "name": "Programming",
        "toolFile": path.join( "../", 'toolListProgramming.json'),
        "defaultDir": path.join( __dirname, "pTestDir"),
        "testDir":path.join( __dirname, "pTestDir"),
    },
    {
        "name": "Writing",
        "toolFile": path.join( "../", 'toolList.json'),
        "defaultDir": path.join( __dirname, "wTestDir"),
        "testDir": path.join( __dirname, "wTestDir"),
    }
];

// Include all tool or be more specific
var testTools = ["all"];
var excludeFiles = ['stderr', 'stdout'];

// Setup Command line arguments.

// Allow specific tools to be selected
if( process.argv.length >= 5)
    testTools = process.argv.slice(4);

if( process.argv.length >= 3 )
    toolTypes[0].testDir = process.argv[2];
if( process.argv.length >= 4 )
    toolTypes[1].testDir  = process.argv[3];

// Load a tool list file
_.forEach( toolTypes, function ( toolType ){

    var allToolsJsonObject = ToolLoader.readToolFileList(toolType.toolFile);

    fs.lstat( toolType.testDir, function( err, stats ) {
        if( err )
        {
           console.log("Error: Retrieving file directory structure.");
           return;
        }

        if( !stats )
        {
            console.log("Error: Invalid file or directory.");
            return;
        }

        var files = [];
        if( toolType.name == "Programming")
        {
            // Programming tool only works with directories.
            files[0] = { "filename": toolType.testDir };
        }
        else
        {
            if( stats.isFile() )
                files[0] = { "filename": toolType.testDir };
            else
            {
                files = fs.readdirSync(toolType.testDir);

                // Remove if part or full name occurs in file.
                files = _.remove(files, function(f){
                    var r =  _.some( excludeFiles, function(fe){
                        return _.includes(f,fe);
                    });
                    return !r;
                });

                console.log("Files ", files);

                files = _.map(files, function(f){
                    return { "filename": path.join( toolType.testDir, f) };
                });
            }
        }

        // For all the tools consider their options.
        // If no options just run tool
        // If options setup with eachh option and run.
        var allJobs = [];
        _.forEach( allToolsJsonObject.tools, function( tool ){

            var processTool = _.find( testTools, function(z) {
                return z == "all" || z == tool.cmdToolName;
            });

            if( processTool )
            {
                var options = tool.options;
                if( options.length == 0 )
                {
                    // Since no options, just return the tool with the job made.
                    var toolWithOptions = ToolLoader.insertOptionsForTool( tool, tool );
                    var toolJob = ToolLoader.buildJobs( [ toolWithOptions ], files, { prefixArg: false} );
                    allJobs.push( toolJob );
                }
                else
                {
                    // Apply each of the options, so far only select is implemented checkbox..etc
                    // might be useful too.
                    _.forEach( options, function( option ){
                        // For each options that has a value try each
                        //console.log("Tool has options ", tool);
                        if( option.type == "select")
                        {
                            // For each value try a value
                            _.forEach( option.values, function( optionVal ){
                                // Most basic option to be set.
                                var newVal = { "options": [{
                                    'name': option.name,
                                    'value': optionVal
                                }]};
                                var toolWithOptions = ToolLoader.insertOptionsForTool( tool, newVal );
                                var toolJob = ToolLoader.buildJobs( [ toolWithOptions ], files, { prefixArg: false} );
                                allJobs.push( toolJob );
                            });
                        }
                    });
                }
            }
        });
        allJobs = _.flatten(allJobs);

        // Run everything in an series (synchronous).
        async.everySeries( allJobs, function(job, callback){
            var cmdPath = _.replace(job.runCmd, "/tools/", "./");
            console.log("Starting process: ", cmdPath);
            exec(cmdPath, {timeout:60*60*15}, function(err,stdout, stderr){
                //console.log('stdout:' + stdout );
                if(stderr || err !== null)
                {
                    console.log( "**** ", cmdPath , " has the following errors:\n");
                    if(stderr)
                        console.log('stderr:' + stderr );
                    if( err !== null)
                        console.log('err->', err);
                    callback(true, null);
                }
                else
                {
                    console.log("Successful: ", cmdPath );
                    callback(null, !err);
                }
            });
        });
    }, function(err, results){
        // Final callback after all jobs.
        console.log("ERR ", err);
        console.log("Results ", results);
    });
});