var Q = require('q');

var queue = require('./kueServer').queue;
var cjob = require('./childJob');
var job = require('./generalJob');
var path = require('path');
var Logger = require( __configs  + "loggingConfig");
var _ = require('lodash');
// This is just a regular reference, it needed a name for managerJob.
const jobType = 'mJob';


/* This function creates a 'ManagerJob', which is a job that starts a bunch of other tools in a queue and waits for feedback.
   This version of the file provides options for the job.
*/
function makeManagerJob( toolOptions ){
    var jobOpts  = job.getDefaults(jobType, 'Manager');
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
    for(var i = 0;i < jobsInfo.length;i++) {
        promises.push( cjob.makeJob( jobsInfo[i] ));
    }
   
    cjob.runJob();
    
    // Wait for everything to finish before emitting that parent is done.    
    Q.allSettled(promises)
        .then( function(res) {
                // return everything that passed and was fulfilled
                // Remove Failed states.
                var passed = _.filter(res, r => { return r.state =='fulfilled' && r.value.success == true; });
                var result = _.map( passed, obj => _.pick(obj, ['value'] ));
                if( result.length > 0)
                    done(null,result);
                done(new Error('No jobs successfully completed.'));
            }, function(reason) {
                // This doesn't occurr because we don't reject child nodes.
                Logger.info("Reason: Error promise all parent.", reason);
            },
            function( notice ){
                // Currently none of the tools have progress reporting so this notifies
                // when received, started, 10% (about to run), and finished.
                if( typeof(notice.value)  == 'object' ) {
                    Logger.info("Notice:", notice.value.msg);
                    //console.log("Notice:", notice.value.msg );
                }
                else {
                    Logger.info("Updating: Completed ", notice.value, " %");
                    //console.log("Updating: Completed ", notice.value, " %" );
                }
            }
        );
}

/* This function is mostly to simplify the calling interface 
   This will start running any created jobs (ie jobs that have been saved )
*/

function runManagerJob() {

    queue.process(jobType, function(job,done) {
        loadAllTools( job, done );
    });
}

//Exports for the module.
module.exports.makeJob = makeManagerJob;
module.exports.runJob = runManagerJob;