const spawn = require('child_process').spawn;
const _ = require('lodash');

module.exports = {

    testObj: {
        progName: 'hunspell',
        targs: ['-d','en_US', '-a', 'testFile.txt']
        //progName: 'ls',
        //targs:[]
    },

    hunspellTool: function( progName, targs ) {
        const spawnObj = spawn(progName, targs);
        const feedbackItems = [];

        spawnObj.stdout.on('data', (data) =>{
            var d = data.toString();
            var allLines = _.split(d,'\n');
            var removedItems = _.remove(allLines, function(word) {
                return (word == '*' || word == '');
            });

            // Quick Parsing from Regular Expressions
            // Format:
            // Symbol [&] meaning incorrect word (char)
            // Incorrect word (word)
            // Number of suggestions (int)
            // characters from start, ie position ( int )
            // Symbol (:)
            // N - Words[,]
            if( allLines.length > 0) {
                //console.log("allLines->", allLines[0]);

                // Check for some of the hunspell app information.
                if(allLines[0].indexOf("@") == 0)
                    return;

                var splitIndex = allLines[0].indexOf(":");
                var firstPart = allLines[0].substr(0,splitIndex);

                var secondPart = allLines[0].substr(splitIndex+1);

                var rePart1 = /^([&]) (\w+) (\d+) (\d+)/;
                var res1 = firstPart.match(rePart1);
                //console.log("RES1:", res1 );

                var rePart2 = /(\w+)/g;
                var res2 = secondPart.match(rePart2);
                //console.log("RES2:", res2 );

                var feedbackItem = {};
                feedbackItem['recommendations'] = [
                    {
                        "error": "Spelling",
                        "position" : { "char":res1[4]},
                        "word": res1[2],
                        "suggestions":  res2
                    }
                ];
                feedbackItems.push(feedbackItem);
                // console.log(feedbackItem['recommendations']);
            }

        });

        spawnObj.stderr.on('data', (data) =>{
            console.error( data.toString() );
        });

        spawnObj.on('close', (code) =>{
            console.log(feedbackItems);
        });

        spawnObj.on('error', data  => {
            console.error("Hunspell_Error occured: ", data.toString() );
        });
        return spawnObj;
    }
};


