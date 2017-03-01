const fs = require('fs');
var natural = require('natural');
var TFIdf = natural.TfIdf;

const cla = require('command-line-args');

function idfSummary( file, options )
{
    fs.readFile(file, 'utf-8', (err,data) => {

        // Create our term frequency and idf object
        if( err )
        {
            console.log("Error: Natural is unable to read file");
            return;
        }

        var tfidf = new TFIdf();
        tfidf.addDocument( data );

        var res =  tfidf.listTerms( 0 ); // We only have one document to check.
        var stopAt = options && options.limit ? options.limit : res.length;

        if( options.console )
        {
            for( var i =0 ; i < stopAt; i++ ) {
                var item = res[i];
                console.log(item.term + '  ' + item.tfidf );
            }
        }
        else
        {
            var jsonOut = '{\n"words":' + JSON.stringify(res) + '\n}'
            console.log(jsonOut);
        }
    });
}

function main() {

    /* -l Number of terms to show 
       -d { all, tf, idf }
    */
   
    const optionDefs = [ 
        { name: 'console', alias:'c', type: Boolean },
        { name: 'file', alias:'f', type: String },
        { name: 'limit', alias:'l', type: Number }
    ];

    try
    {        const options = cla( optionDefs );
        if( !options.file )
        {

            console.log("Error: Natural is unable to process without a text file");
            process.exit(-1);
        }

        if( fs.existsSync(options.file)  )
        {
            idfSummary( options.file, options );
        }
    }
    catch (e) {
        console.log("Error: Natural could not process file.");
    }

   return 0;
}

main();
