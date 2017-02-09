var fs = require('fs');

const stream = require('stream');


var filename = process.argv[2];
var readable = fs.createReadStream(filename);


readable.on('data', (chunk) => {
	console.log( "C:" +  chunk + "\n\n\n" );
});


