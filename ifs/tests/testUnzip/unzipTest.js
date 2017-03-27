
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require("fs");
var _ = require('lodash');

if( process.argv.length <=2 )
{
    // About what the program does.
    console.log("We're testing open and reading a zip file, please provide a file with path to a zip file.")
    process.exit(-1);
}

var file = process.argv[2];
console.log("Receive filed " + file );


const execSync = require('child_process').execSync;


function getExt( filename ) {
    if(!filename)
        return "";
    console.log("GETXT,", filename );
    var extId = filename.lastIndexOf(".");
    return (extId >= 0 ? filename.substr(extId+1) : "");
}


function findFilesSync( startDir ) {

    console.log("HERE FFS", startDir );
    if( !fs.lstatSync(startDir).isDirectory() ) {
        console.log("Does not exist Find files sync");
        throw {error: "Directory: does not exists"};
    }
    console.log("FindFiles");

    var arr = [];
    var files = fs.readdirSync(startDir);
    for( var i = 0; i < files.length; i++ ) {
        var filename = path.join( startDir, files[i] );
        var stat = fs.lstatSync(filename);
        if( stat.isDirectory() ) {
            arr = arr.concat( findFilesSync( filename ) );
        }
        else
            arr.push( filename );
    }
    return arr;
}


function unarc( file, options ) {
    options = options || {};
    options.dir = options.dir || "./unzipped";
    var res = {}
    try {
        var call = "";
        var folderCreated = false;
        var ext = getExt(file );
        
        if(  ext == 'gz') {
            folderCreated = mkdirp.sync( options.dir );
            options.params = options.params || "-xzf";
            call = "tar " + options.params + " " + file + " -C " + options.dir;
        }
        else if( ext == 'zip')  {
            
            folderCreated = true;
            options.params = options.params || "-q ";
            call ="unzip " + options.params + file + " -d " + options.dir;
        }
        console.log(" About to make: ", call );
        if( folderCreated ) {
            execSync( call );
        }
        else 
            throw "Can't create folder";
    }
    catch ( e ) {
        var err = {err:"Unable to extract files: " + file}
        console.log(err.err);
        return err;
    }

    return {};
}

function validateProjectStructure( groupedFiles ) {

    var res = {};
    if( groupedFiles ) {
        var noExts = _.get(groupedFiles, "");
        var makeFile = 'unzipped/Makefile'
        var hasMakeFile = _.includes(noExts, makeFile) || _.includes(noExts, _.lowerCase(makeFile) );

        if( !noExts || !hasMakeFile ) {
            return {err:"Unable to identify project makefile, please ensure file you've included a makefile at the top level of your project."}
        }

        var cFiles = _.get(groupedFiles,"c");
        var hFiles = _.get(groupedFiles,'h');

        if( !cFiles ) {
            return { err: "Unable to locate source (.c) files in project."}
        }
        
        if( !hFiles )  {
            return { err: "Unable to locate header (.h) files in project."}
        }
    }
    //Everything looks ok.
    return {};
}

unarc(file, {} );

var res = findFilesSync("./unzipped");

console.log("H: res ", res);

var res1 = _.groupBy(res, getExt);

console.log("Res1", res1 );
console.log("Validating ", validateProjectStructure({}));
