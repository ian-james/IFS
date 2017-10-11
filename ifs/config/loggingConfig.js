const winston = require('winston');
require('winston-daily-rotate-file');

const fs = require('fs');
const path= require('path');

// Identify if we're in development mode or production mode
const env = process.env.NODE_ENV || 'dev';
console.log("ENV HERE IS ", env);

//Loggin directory.
const logDir = "logs";

/*Create folders if necessary*/
if( !fs.existsSync(logDir) ) {
    fs.mkdirSync(logDir);
}

// Setup a timestamp in the logs
const tsFormat = () => (new Date()).toLocaleTimeString();


/* Create multiple loggers for errors,info and Console information.
   Other levels available if needed but you can create the logger.
   Most of these options made sense at the time but change if needed.
   -JF
*/

/* Winston might need to be substitued out after looking at a number of issues in GitHub that are simply
   not being address. NPMLOG is an alternative that was recommended with much more recent activity.
   Let keep on eye on this and change if needed, the feature listed below should be available in whatever we pick.   
   -JF
*/

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: env == 'dev' ?  'debug' : 'info',
            //timestamp: tsFormat(),
            handleExceptions: true,
            colorize:true,
            json:true
        }),
        new (winston.transports.DailyRotateFile)({
            level:  env == 'production' ? 'debug'  :'info' ,
            filename: path.join( logDir, '-logFile.log'),
            handleExceptions: true,
            json: true,
            timestamp: tsFormat(),
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            maxFiles: 5,
            maxsize: 524880
        })
    ],
    exitOnError: false
});

//Export
module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
}