var queue = require('./kueServer');
var cjob = require('./childJob');
var Logger = require( __configs + "loggingConfig" );

var Q = require('q');

function jobConfig(jobType, jobName) {
    // Default options, times are in milliseconds (1000)
    return {
        priority: 'normal',
        attempts:1,
        backoff: {delay:10*1000, type:'fixed'},
        timeOfLife:2*60*1000,
        removeIfDone: true,
        jobType:jobType,
        jobName: jobName,
    };
}

function makeJob(toolOptions, jobOpts) {
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
        deferred.notify({ msg:"Task Received", "tool": job.data.name, progress: 0});
    })
    .on('start', function() {
        deferred.notify({ msg:"Starting", "tool":job.data.name, progress: 0});
    })
    .on('progress', function(progress, data) {
        deferred.notify( { msg:"Progress", "tool": job.data.name, progress: progress} );
    })
    .on('complete', function(result) {
        deferred.notify({ msg:"Completed", "tool": job.data.name, progress: 100});
        deferred.resolve({
            done: true,
            job: job.data,
            success: true,
            result: result
        });
    })
    .on('failed', function(errorMessage) {
        deferred.reject({
            done: true,
            job: job.data,
            success: false,
            result: []
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
