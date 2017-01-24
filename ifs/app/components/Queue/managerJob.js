var Q = require('q');

var queue = require('./kueServer').queue;
var cjob = require('./childJob');
var job = require('./generalJob');

// This is just a regular reference, it needed a name for managerJob.
const jobType = 'mJob';


// Setup a basic config with manager process name
function getManagerConfig()
{
    return job.getDefaults(jobType,'Manager');
}
   

/* This function creates a 'ManagerJob', which is a job that starts a bunch of other tools in a queue and waits for feedback.
   This version of the file provides options for the job.
*/

function makeManagerDefaultJob( toolOptions ){
    var c = getManagerConfig();
    return makeManagerJob( toolOptions, c );
}

// Manager job with more options and generalizations.
function makeManagerJob( toolOptions, jobOpts )
{
    // Don't override jobName but make sure it at least had process
    jobOpts['jobType'] =jobType;
    return job.buildJob( toolOptions, jobOpts );
}

/* This function creates a promise for each tool, that requires the tool to finish running or error 
   and return a result. Essentially, this starts all the assessment tools  on a second cJob queue
   and waits for the feedback.
*/

function loadAllTools(job, done)
{
    job.emit('start');
 
    //TODO: THis needs to grab these commands from job;
    var promises = [];
    var options = job.data.tool;
    for(var i = 0;i < options.length;i++)
    {
        var cmdObj = options[i];
        console.log("CmdObj",cmdObj);
        var cmd = cmdObj['progName'] + ( cmdObj['options'] || '');
        cmdObj["runCmd"] = cmd;

        promises.push( cjob.makeJob( cmdObj ));
    }

    
    //cjob.makeJob( { "prog": "ls -l | grep ad"} ).then( function(x){ console.log(x); });
    //promises.push( cjob.makeJob( "ls -l | grep ad") );
    //promises.push( cjob.makeJob( "ls -lh | grep ts") );    

    runChildJob( cjob.jobType );
    
    // Wait for everything to finish before emitting that parent is done.    
    Q.all(promises)
        .then( function(res) {
            job.emit('completed');
            done(null,res);
        });
}

/* This function is mostly to simplify the calling interface 
   This will start running any created jobs (ie jobs that have been saved )
*/

function runManagerJob() {

    queue.process(jobType, function(job,done) {
/*
        var domain = require('domain').create();

        domain.on('error', function(err) {
            done(err);
        });

        domain.run( function() {
            console.log("Running Job!", jobName);
            console.log("Load all tools")
            loadAllTools( job, done );
        });
        */
        console.log("Running Parent!", jobType);
        console.log("Load all tools")
        loadAllTools( job, done );
       
    });
}

function runChildJob( jobName ){

    queue.process(jobName, function(job,done) {
/*
        var domain = require('domain').create();

        domain.on('error', function(err) {
            done(err);
        });

        domain.run( function() {
            console.log("Running Job!", jobName);
            console.log("Load all tools")
            cJob.handleTool( job, done );
        });
        */
       
        console.log("Running Job!", jobName);
        console.log("Load all tools")
        cjob.handleTool( job, done );
    });
}


//Exports for the module.
module.exports.makeJob = makeManagerDefaultJob;
module.exports.handleTool = loadAllTools;
module.exports.runJob = runManagerJob;
module.exports.runChildJob = runChildJob;