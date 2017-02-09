
// Source - > File or String

// Location
        // Character Number // Word Number // Sentance Number // Line (or Section Number
        //

// Feedback Item too look for

// Function to perform on each match

/* Description, we need to find the location of feedback item in the original source
   The original source a newly constructured version of the text will exist with new tags.

*/

// Return

// Exact text match (unless inserting '-' )
// 
// 
/* Notes
   readline, is a bit of misnomer as it actually reads paragraphs or anything until a breakline.
   So we actually have to break up the text further

*/



/*
function addTags( inputOptions, callback ){

    // Get Source information
    var srcOpts = inputOptions.input || {'arg': "Don't use the default add tags"};
    var srcStream = createStream( srcOpts );
    var outStream = new stream.Writable;

    var feedbackItems = inputOptions.feedbackItems;

    const rl = readLine.createInterface({
        input: srcStream,
        output: outStream
    });

    var stats = {
        charCount : 0,
        wordCount : 0,
        sentanceCount : 0,
        sectionCount : 0,
        found: 0,
        missed: 0,
    };

    var location =  { 
        feedbackIndex : 0,
        position : 0
    };

    rl.stats = stats;
    rl.location = location;
    rl.feedbackItems = feedbackItems;

    rl.on('line', (input) => {
        // We received a section  of text.
         
        var sentances = sentanceToker.tokenize( input );
        for( var si = 0; si < sentances.length; si++ ) 
        {
            // For Each Wor
            var words = wordToker.tokenize( words );
            for( var wi = 0;wi < words.length;wi++ ) {

                if(word == feedbackItem)
                    put

                rl.stats.wordCount++;
            }

            rl.stats.sentancCount++;
        }   
        rl.stats.sectionCount++;
    });

    rl.on('close', () => {
    });
}

*/

