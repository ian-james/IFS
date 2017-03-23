var queue = require('./kueServer').queue;
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var job = require('./generalJob');
var Q = require('q');

var fs = require('fs');

const jobType = 'cJob';

/* Tool Options 
    Should present a number of values in the obj, should be validated in some way.
    displayName
    progName -> callable from command line
    arguments -> an array of arguments or whatever the program expects.
*/
function makeJob( toolOptions ) {
    var jobOpts = job.getDefaults(jobType,toolOptions.displayName );
    return job.buildJob( toolOptions, jobOpts );
}

/*
 Potential that tools could report their progress if spawn was used instead of exec.
 Not ready to make this change, since I don't think we have tools that report progress.
 */
function runSingleTool( job, done )
{ 
    //console.log(" HERE AT RUN SINGLE TOOLCMD", job.data.tool.runCmd);
    job.progress(10, 100);
    var child = exec(job.data.tool.runCmd, function(error,stdout, stderr) {

        job.progress(100,100);
        if( error) {
            console.log("Got an error:", stderr );
            done(new Error('exec error'));
            return;
        }
        try {
            console.log(stdout);
            var res = JSON.parse( stdout );
            done(null, res);
            job.emit('completed');
        }
        catch(e) {
            job.emit('failed');
            done(new Error('Can not parse result'));
        }
    });
}

function runChildJob(){

    queue.process(jobType, function(job,done) {
        runSingleTool( job, done );
    });
}


module.exports.makeJob = makeJob;
module.exports.handleTool = runSingleTool;
module.exports.runJob = runChildJob;