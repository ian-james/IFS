var Q = require('q');

var queue = require('./kueServer');
var cjob = require('./childJob');
var job = require('./generalJob');
var path = require('path');
var Logger = require( __configs  + "loggingConfig");
var now = require("performance-now");
var _ = require('lodash');
var cluster = require('cluster')
var spawn = require('child_process').spawn;

// This is just a regular reference, it needed a name for managerJob.
const jobType = 'mJob';
const JobConCurrent = 10;

/* This function creates a 'ManagerJob', which is a job that starts a bunch of other tools in a queue and waits for feedback.
   This version of the file provides options for the job.
*/
function makeManagerJob(toolOptions) {
    var jobOpts = job.getDefaults(jobType, 'Manager');
    return job.buildJob(toolOptions, jobOpts);
}

/* This function creates a promise for each tool, that requires the tool to finish running or error
   and return a result. Essentially, this starts all the assessment tools  on a second cJob queue
   and waits for the feedback.
*/

function cTest(jobList)
{
    // console.log(jobList);

    var argStr = "";
    var cmdArr = [];

    for (var i = 0; i < jobList.length; i++)
    {
        argStr = "\"" + jobList[i].runCmd + "\"";
        cmdArr.push(argStr);

    }


    var child = spawn("./test", cmdArr);

    child.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        //Here is where the output goes
    });

    child.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
        //Here is where the error output goes
    });

    child.on('close', function(code) {
        console.log('closing code: ' + code);
        //Here you can get the exit code of the script
    });



}

function loadAllTools(job, done) {
    job.emit('start');


    var t0 = now();
    var t1 = now();

    var promises = [];
    var jobsInfo = job.data.tool;


    //creates a promise for each job to be executed
    for(var i = 0;i < jobsInfo.length;i++) {
        promises.push( cjob.makeJob( jobsInfo[i] ));
    }

    // this was to test efficiency of running the tools with C
    // cTest(jobsInfo);

    cjob.runJob();

    var count = 0;

    var p = Q.all(promises);

    // Wait for everything to finish before emitting that parent is done.
    Q.allSettled(promises)
    .then(function(res) {
        t1 = now();

        // printing time it takes to run the tools
        console.log("time taken to run jobs is: " + (t1 - t0) + " milliseconds");

        // return everything that passed and was fulfilled
        var passed =[], failed = [];

        for(var i = 0; i < res.length; i++) {
            if(res[i].state == 'fulfilled') {
                var val = res[i].value;

                // Attach these two fields from job tool to the result.
                var toolAdd = {"displayName": val.job.tool.displayName, "runType": val.job.tool.runType};
                _.extend(val.result.feedback,toolAdd);

                if(val.success) {
                    if(val.result.feedback)
                        passed = passed.concat(val.result.feedback)
                    else
                        Logger.error("Successful tool", job.tool.toolName, " did not format output correctly");
                }
                else  {
                    // If the job failed, just get the error.
                    failed = failed.concat(val.result);
                }
            }
            else if( res[i].state == 'rejected') {
                failed.push(res[i].reason.job);
            }
        }
        var Err = passed.length == 0 ? new Error('No jobs successfully completed.') : null;
        done(Err, { 'passed': passed, 'failed': failed });

    },

    function(reason) {
        // This doesn't occurr because we don't reject child nodes.
        Logger.info("Reason: Error promise all parent.", reason);
        done( new Error("Unable to complete any jobs") );
    },

    function(notice) {
        // Currently none of the tools have progress reporting so this notifies
        // when received, started, 10% (about to run), and finished.
        // Manager varies done based on jobs that need to run and those that finished.
        if (typeof(notice.value)  == 'object') {
            if (notice.value.msg == "Completed") {
                count++;
                job.progress(count,jobsInfo.length);
            }
            Logger.info("Notice:", notice.value.msg," Tool", notice.value.tool, " at ", notice.value.progress, "%");
        }
        else {
            Logger.info("Received:", notice );
        }
    });


}

/* This function is mostly to simplify the calling interface
   This will start running any created jobs (ie jobs that have been saved )
*/
function runManagerJob() {
    queue.getQueue().process(jobType, JobConCurrent , function(job,done) {
        loadAllTools( job, done );
    });
}

//Exports for the module.
module.exports.makeJob = makeManagerJob;
module.exports.runJob = runManagerJob;
