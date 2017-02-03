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

function combineResults( response )
{
    var allResults = [];
    for(var i = 0;i < response['result'].length;i++) {
       var tempJob = response['result'][i].job;
       tempJob['result'] = response['result'][i].result;
       Logger.info("J",i, ":",  tempJob );
       allResults.push(tempJob);
    }
    return allResults;
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

    var promises = [];
    var jobsInfo = job.data.tool;
    for(var i = 0;i < jobsInfo.length;i++)
        promises.push( cjob.makeJob( jobsInfo[i] ));
    
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
        loadAllTools( job, done );
    });
}

function runChildJob( jobName ){

    queue.process(jobName, function(job,done) {
        cjob.handleTool( job, done );
    });
}


//Exports for the module.
module.exports.makeJob = makeManagerDefaultJob;
module.exports.handleTool = loadAllTools;
module.exports.runJob = runManagerJob;
module.exports.runChildJob = runChildJob;
module.exports.combineResults = combineResults;