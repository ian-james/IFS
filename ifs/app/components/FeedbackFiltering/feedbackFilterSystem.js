/*
    Full Call and Feedback is available just before this step
    but this stage should get the results

    Should receive an array of objects
        each object should have a field called 'feedback'
            'feedback' is an array containing a number of fields
                // 'see exampleFeedback for a similar list of fields'
                // main fields include
                // target
                // lineNum
                // wordNum
                // suggestions = [ words ]
                // type
                // feedback
                // toolName

 */

var path = require("path");
var fs = require("fs");
var Logger = require( __configs + "loggingConfig");

function createFileObject( fileItem ) 
{
    /* Create a file object of the form:
        {
            "filename": "test.txt",
            "contentFile": "./tests/testFiles/test.txt",
            //"cFile": "./tests/test.html",
            "content": ""
        }
    */
   
    var obj = {};
    obj["filename"] = fileItem.originalname;
    obj["contentFile"] = fileItem.filename;
    obj["content"] = "";
    return obj;
}

function createFeedbackObject( fbItem ) 
{
    /*
    var obj = {};
    obj['target'] = filename.originalname; //path.basename(fileItem.filename)
    obj['lineNum'] = fileItem.filename;
    obj['wordNum'] = "";
    obj['toolName'] = "";
    obj['type'] = "";
    obj['feedback'] = "";
    obj['suggestions'] = "";
    */
   
   // Currently these don't need to be parsed further.
   return fbItem;
}

function createObjects( items, createFunc ) 
{
    var arr = [];
    for( var i =0; i< items.length; i++ ) {
        arr.push(createFunc( items[i]));
    }
    
    return arr;
}

function createFeedbackObjects( items )
{
    var arr = [];
    
    for( var i =0; i< items.length; i++ ) {
        var res = items[i].result;
        var resObj = JSON.parse(res);

        if(resObj && resObj["feedback"] ) { 
            arr = arr.concat( createObjects(resObj.feedback, createFeedbackObject) );
        }
    }
    return arr;
}

/* 
    This function creates the json object for the parsing and  highlightin system.
    Basically, it needs to create two fields file.   
*/
function organizeResults( fileInfo, fullData )
{
    var obj = {};
    obj['files'] = createObjects( fileInfo, createFileObject );
    obj['feedback'] = createFeedbackObjects( fullData );
    obj['feedbackFiles'] = writeResults(obj);
    return obj;
}

function writeResults( obj )
{
    // Get upload directory    
    var uploadDir = path.dirname( obj.files[0].contentFile );
    
    var filename = "displayedFeedback.json";
    var file = path.join(uploadDir,filename);
    Logger.info("Wriring FeedbackFile:", file);
    fs.writeFileSync( file , JSON.stringify(obj), 'utf-8');

    return file;
}

module.exports.organizeResults = organizeResults;