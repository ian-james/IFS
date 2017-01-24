var queue = require('./kueServer');
var cjob = require('./childJob');

var Q = require('q');

function jobConfig(jobType, jobName)
{
    // Default options, times are in milliseconds (1000)
    return{ 
        priority: 'normal',
        attempts:3,
        backoff: {delay:10*1000, type:'fixed'},
        timeOfLife:60*1000,
        removeIfDone: true,
        jobType:jobType,
        jobName: jobName,
    };
}

function makeDefaultJob( toolOptions ) {
    return makeJob( toolOptions, jobConfig );
}

function makeJob(  toolOptions, jobOpts )
{
    var deferred = Q.defer();
    
    var job = queue.queue.createJob(jobOpts.jobType, {
            name:jobOpts.jobName,
            tool: toolOptions,
        })
        .priority(jobOpts.priority)
        .attempts(jobOpts.attempts)
        .backoff( jobOpts.backoff )
        .ttl(jobOpts.timeOfLife);

    job.on('enqueue', function() {
        //console.log( job.data.name + " has been enKued");
    })
    .on('start', function() {
        ///console.log(job.data.name + " has been Started");
    })
    .on('progress', function(progress, data) {
        //console.log(job.data.name + "progressing");
    })
    .on('complete', function(result) {
        //console.log("*****1COMPLETE JOB IS ", JSON.stringify(job.data));
        //console.log("*****2COMPLETE JOB IS ", JSON.stringify(job));
        //console.log("*****3COMPLETE JOB IS ", JSON.stringify(result));
        deferred.resolve({
            done: true,
            job: job.data,
            success: true,
            result: result
        });
    })
    .on('failed', function( errorMessage) {
        //console.log("*****JOB IS ", job.data);
        deferred.resolve({
            done: true,
            job: job.data,
            success: false,
        });
    })
    .removeOnComplete(jobOpts.removeIfDone).save(function(err) {
        if(err) console.log(" Error jobID", job.id, " saving");
    });

    return deferred.promise;
}

// Exports 
module.exports.buildJob = makeJob;
module.exports.buildDefaultJob = makeDefaultJob;
module.exports.getDefaults = jobConfig;