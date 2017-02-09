var nodePandoc = require('node-pandoc');
var path = require('path');

function testFileReading( filename )
{

	// Convert doc to 
	args = '-f docx -t markdown -o ./markdownResult.md';

	nodePandoc(filename, args, function(err,result) {
	
		if( err ) {
			console.log("Error reading the file");
		}
	
		console.log( result );
		return result;
	});
}


// NO Main just a quick script test.

if( process.argv.length <=2 )
{
	// About what the program does.
	console.log("We're testing open and reading a docx file, please provide a file with path to a docx file.")
	process.exit(-1);	
}

var file = process.argv[2];
console.log("Receive filed " + file );


if( path.extname( file )  == '.docx')
	testFileReading( file );
else
	console.log("Please provide a doc file");


