const readLine = require('readline');
const fs = require('fs');

function readFile( filename ) {

	var count = 0;
	const rl = readLine.createInterface({
		input: fs.createReadStream( filename )
	});
	
	rl.lineCount = 0;
	rl.wordCount = 0;
	rl.feedback = [ {
		"type": "spelling",
		"line": 2,
		"num":2,
		"target": "Jamey"
		},
		{
		"type": "spelling",
		"line": 11,
		"num":20,
		"target":"volutpat",
		}
	];
	rl.feedbackIndex =0;

	rl.on('line', (input) =>  {
		rl.lineCount = rl.lineCount + 1;
		console.log("COUNTING Lines:",rl.lineCount,"\n");

		var str  = input.trim()
		var words = str.split(" ");
		if( words && words[0] != "") {
			console.log(str);
			var lineWordCount = words.length;
			if(rl.feedbackIndex < rl.feedback.length &&  rl.feedback[rl.feedbackIndex].line == rl.lineCount)
			{
					//If target exists in line
					// for each word per line add a map that stores the error and all information 
					// each word might have multiple errors and multiple tool suggestions
					// so a map -> linkedLIst sort of implentation would be good.
					var idx =  words.indexOf(rl.feedback[rl.feedbackIndex].target);
					if(idx >= 0 )
					{
						console.log("\n** ", str, " **");
						console.log("************************************Found word on word:", idx);
						rl.feedbackIndex = rl.feedbackIndex + 1
					}
					else
						console.log("Didn't find word")
			
				
			}

			rl.wordCount = rl.wordCount + words.length;
		}


		console.log("COUNTING WORDS:",rl.wordCount,"\n");
	});
}


if( process.argv.length <=2 )
{
	// About what the program does.
	console.log("We're testing open and reading a docx file, please provide a file with path to a docx file.")
	process.exit(-1);	
}

var file = process.argv[2];
console.log("Receive filed " + file );

readFile(file);
