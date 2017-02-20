var Q = require('q');

var queue = require('./kueServer');
var exec = require('child_process').exec;
var job = require('./generalJob');

var fs = require('fs');

const jobType = 'cJob'

/* Tool Options 
    Should present a number of values in the obj, should be validated in some way.
    displayName
    progName -> callable from command line
    arguments -> an array of arguments or whatever the program expects.
*/

// Setup a basic config with child process name
function getChildConfig()
{    
    return job.getDefaults(jobType, 'WorkerTool');
}

function makeToolDefaultJob( toolOptions ){
    var c = getChildConfig();
    return makeToolJob(toolOptions, c );
}

function makeToolJob( toolOpts, jobOpts )  {
    jobOpts['jobType'] = jobType;
    return job.buildJob( toolOpts, jobOpts );
}

// programOptions
// programName and arguments
function runSingleTool( job, done )
{ 
    //console.log(" HERE AT RUN SINGLE TOOLCMD", job.data.tool.runCmd);
    var child = exec(job.data.tool.runCmd, function(error,stdout, stderr) {

        if(error) {
            job.emit('failed');
            done( new Error('exec error'));
        }
        job.emit('completed');
        done(null, stdout);
    }); 
}

module.exports.makeJob = makeToolDefaultJob;
module.exports.handleTool = runSingleTool;
module.exports.jobType = jobType;