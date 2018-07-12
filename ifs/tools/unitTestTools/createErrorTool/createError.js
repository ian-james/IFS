var fs = require('fs');
var _ = require('lodash');
const commandLineArgs = require('command-line-args');

const optionDefintion = [
    { name: 'badData', alias: 'b', type: Boolean },
    { name: 'jsonBad', alias: 'j', type: Boolean },
    { name: 'error', alias: 'e', type: Boolean },
    { name: 'noData', alias: 'n', type: Boolean }
];

const options = commandLineArgs(optionDefintion);

/* 
    Program just tests all the possible resolutions from a program.
*/
function main( opts )
{
    var str = "";
    var keys = _.keys(opts);
    _.forEach( keys , function( opt ){
        if( opt == "badData") {
            console.log("Regular english test.");
            return;
        }
        else if( opt == "error" ) {
            var s = { msg:"Crash Error" , 
                      error: true
                };
                s = JSON.stringify(s);
            const e = new Error(s);
            throw e;
        }
        else if( opt == "jsonBad" ) {
            var s = { feedback: "TEST", msg:"Bad JSON DATA"};
            console.log( JSON.stringify( s ) );
            return;
        }
        else if( opt == "noData" ){
            console.log(JSON.stringify(str));
            return;
        }
    });
}
main(options);
