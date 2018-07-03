var queue = require('./kueServer');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var job = require('./generalJob');
var Q = require('q');

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

const jobType = 'cJob';
const JobConCurrent = 10;

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

/**
 * This funciton creates a file to pipe feedback from tools into.
 * Unlike previous iteration it handles 'chunks of data' and thus isn't buffer limited.
 * @param  {[type]}   job  [description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
function runSingleTool( job, done )
{
    // Fake progress to demonstrate some progress
    job.progress(10, 100);

    // Use the tool run command and split into arguments since spawn needs argument list.
    var runCMD = job.data.tool.runCmd;
    var splitCMD = runCMD.split(' ');
    _.pull(splitCMD,'',' ');

    // Create a file in user folder to store feedback
    // Format: feedback_simpleToolName_originalFileName
    var easyToolName = job.data.tool.cmdToolName;
    var uploadFilename = splitCMD[splitCMD.length - 1 ];
    var uploadDir = path.dirname( uploadFilename );
    var filepath =  path.join(uploadDir, "feedback" + "_" + easyToolName + "_" + path.basename(uploadFilename));

    //Create write stream to pipe results as they arrive into a file.
    const ws = fs.createWriteStream( filepath );

    // Spawn a child to handle process
    child = spawn(splitCMD[0], splitCMD.slice(1));

    var error = false;

    // Setup the pipe, this is similar to stderr Event except its shorthand format.
    child.stdout.pipe(ws);

    // Event to handle stderr
    child.stderr.on('data', function(data) {
        if(data) {
            error = true;
            job.emit('failed');
            return;
        }
    });

    // Event on close to indicate progress has finished and close the stream.
    child.on('close', function(code) {
        job.progress(100,100);
        ws.end();
        if(error) {
            var err = {"code":-1, "response":new Error("Failed to execute assessment tool: " + job.data.name)};
            done(JSON.stringify(err));
            job.emit('failed');
        }
        else {
            done(null, {"code":code, "feedback":{"file":filepath}});
            job.emit('completed');
        }
    });
}

function runChildJob(){

    queue.getQueue().process(jobType, JobConCurrent, function(job,done) {
        runSingleTool( job, done );
    });
}

module.exports.makeJob = makeJob;
module.exports.handleTool = runSingleTool;
module.exports.runJob = runChildJob;