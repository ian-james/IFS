var queue = require('./kueServer');
var cjob = require('./childJob');
var Logger = require( __configs + "loggingConfig" );

var Q = require('q');

function jobConfig(jobType, jobName)
{
    // Default options, times are in milliseconds (1000)
    return{ 
        priority: 'normal',
        attempts:1,
        backoff: {delay:10*1000, type:'fixed'},
        timeOfLife:2*60*1000,
        removeIfDone: true,
        jobType:jobType,
        jobName: jobName,
    };
}

function makeJob(  toolOptions, jobOpts )
{
    var deferred = Q.defer();
    
    var job = queue.queue.create(jobOpts.jobType, {
            name:jobOpts.jobName,
            title:jobOpts.jobName,
            tool: toolOptions,
        })
        .priority(jobOpts.priority)
        .attempts(jobOpts.attempts)
        .backoff( jobOpts.backoff )
        .ttl(jobOpts.timeOfLife);

    job.on('enqueue', function() {
        //console.log( job.data.name + " has been enKued");
        deferred.notify({ msg:"Task Received", "tool": job.data.name, progress: 0});
    })
    .on('start', function() {
        //console.log(job.data.name + " has been Started");
        deferred.notify({ msg:"Starting", "tool":job.data.name, progress: 0});
    })
    .on('progress', function(progress, data) {
        deferred.notify( { msg:"Progress", "tool": job.data.name, progress: progress} );
    })
    .on('complete', function(result) {
        //console.log("*****1COMPLETE JOB IS ", JSON.stringify(job.data));
        //console.log("*****2COMPLETE JOB IS ", JSON.stringify(job));
        //console.log("*****3COMPLETE JOB IS ", "=>", JSON.stringify(result));
        deferred.notify({ msg:"Completed", "tool": job.data.name, progress: 100});
        deferred.resolve({
            done: true,
            job: job.data,
            success: true,
            result: result
        });
    })
    .on('failed', function( errorMessage ) {
        Logger.error("Error job failed", job);
        deferred.reject({
            done: true,
            job: job.data,
            success: false,
            result: null
        });
    })
    .removeOnComplete(jobOpts.removeIfDone).save(function(err) {
        if(err) Logger.error("Error job to save failed", job.name);
    });

    return deferred.promise;
}

// Exports 
module.exports.buildJob = makeJob;
module.exports.getDefaults = jobConfig;