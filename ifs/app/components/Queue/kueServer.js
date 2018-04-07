var  kue =  require('kue');
var kOptions = require("./kuaServerConfig.js").testKue;

var queue = kue.createQueue(kOptions.kueOpts);
var Logger = require( __configs + "loggingConfig" );

// Watch for stuck jobs, as PER REQUEST on GITHUB
Logger.info("Watching for stuck jobs: timeout: " + kOptions.options.watchStuckTime)
queue.watchStuckJobs(kOptions.options.watchStuckTime);


//Help removing large number of jobs for debugging only
/*
kue.Job.rangeByState('complete',0, 5000, 'asc', function(err,jobs){
    jobs.forEach( function(job) {
        job.remove( function() {
            console.log('removed', job.id);
        });
    });
});


kue.Job.rangeByState('active',0, 15000, 'asc', function(err,jobs){
    jobs.forEach( function(job) {s
        job.remove( function() {
            console.log('removed', job.id);
        });
    });
});

kue.Job.rangeByState('inactive',0, 15000, 'asc', function(err,jobs){
    jobs.forEach( function(job) {
        job.remove( function() {
            console.log('removed', job.id);
        });
    });
});
*/

kue.Job.rangeByState('failed',0, 1000, 'asc', function(err,jobs){
    jobs.forEach( function(job) {
        job.remove( function() {
            console.log('removed', job.id);
        });
    });
});

queue.on('ready', () => {
    Logger.info("Kue is ready");
});

queue.on('error', (err) => {
    Logger.error(err);
    Logger.error(err.stack);
});

// Handle crashes with graceful shutdown
process.once('SIGTERM', function(sig) {
    var timeout=5000;
    queue.shutdown(timeout, function(sig){
        Logger.error('Kue shutdown: ', err || '');
        process.exit(0);
    });
});

// Setup the UI, Kue comes with an UI at the port listed to display upcoming jobs in the queue.
kue.app.set('title',kOptions.ui.title);
kue.app.listen(kOptions.ui.port);

module.exports.queue = queue;
