const fs = require('fs');
var natural = require('natural');


var tokenizer = new natural.SentenceTokenizer();
//var tokenizer = new natural.TreebankWordTokenizer();

if( process.argv.length <=2 )
{
    // About what the program does.
    console.log("We're testing open and reading a docx file, please provide a file with path to a docx file.")
    process.exit(-1);
}

var file = process.argv[2];
console.log("Receive filed " + file );

var string = fs.readFileSync( file, 'utf-8' );

var result = tokenizer.tokenize( string );


console.log("Result:>", result );
console.log("Summary", result.length);