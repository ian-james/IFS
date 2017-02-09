var path = require('path');

var childProcess = require('child_process');

var cmd = 'soffice'

function makeCmd(  inFile, outFile)
{
	return [ "--headless", "--convert-to","txt:Text", inFile, '--outdir', outFile ];
}

function testFileReading( inFile, outFile )
{
	var c =  makeCmd( inFile, outFile);vim 
	console.log("Command will be :",c );
	var runnable = childProcess.spawnSync(cmd, c);

		console.log('runnable');
		Ponsole.log('runnableStdOut',runnable.stdout);
		console.log('status',runnable.status);
		console.log('error',runnable.error);

}


if( process.argv.length <=3 )
{
	// About what the program does.
	console.log("We're testing open and reading a docx file, please provide a file with path to a docx file.")
	process.exit(-1);	
}

var file = process.argv[2];
console.log("Receive filed " + file );

var outDir = process.argv[3];

console.log("Receive filed " + outDir );

if( true || path.extname( file )  == '.docx')
	testFileReading( file ,outDir);
else
	console.log("Please provide a doc file");


