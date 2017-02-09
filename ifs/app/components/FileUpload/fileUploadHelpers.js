var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var unzip = require('unzip');
var _ = require('lodash');

var Logger = require( path.join( __dirname, "/../../../config/" + "loggingConfig") );

module.exports =  {

   /* Helper functions */
    getYearMonthDayStr:function (){
        var dateObj = new Date();
        var arr = [ dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()];
        return arr.join('-');
    },

    getExt: function ( filename ) {
        var extId = filename.lastIndexOf(".");
        return (extId >= 0 ? filename.substr(extId+1) : "");
    },

    // This checks zip, tar and tz. (Only tested zip)
    isZip: function (filename) {
        var ext = path.extname(filename);
        return  ext == ".zip" || ext == ".tar" || ext == '.gz';
    },

    // This check .odt, .docx and .doc  files
    isDoc: function ( filename ) {

        var ext = path.extname(filename);
        return  ext == ".doc" || ext == ".docx" || ext == '.odt';
    },

    handleZipFile: function ( zipfile )
    {
        if( zipfile && this.isZip(zipfile) ){
            
            //TODO: This has only been tested with zip.
            try {
                var stream = fs.createReadStream(zipfile);
                stream.on('error', function(error) {
                    Logger.error("Error caught error reading", error);
                });
                stream.pipe(unzip.Extract( {path: path.dirname(zipfile)} ) );
            }
            catch(err) {
                Logger.error("Unable to unzip file.")
            }

        }
    },

    // This function takes the isDoc type and creates a .txt file with the same name
    // and in the same folder. 
    // (TODO) Error is logged but not handled.
    handleDocxFile: function ( filename )
    {
        if( filename && this.isDoc(filename) )
        {
            var spawn = require('child_process').spawn;
            var outDir = path.dirname(filename);
            var args =  [ "--headless", "--convert-to","txt:Text", inFile, '--outdir', outDir ];
            
            // This call soffice (Libra to handle conversion)
            var convertToTxt = spawnSync('soffice', args );

            if(convertToTxt.error) {
                Logger.error("Unable to parse document file.");
            }
        }
    },

    // This function gets the file names from Multer, appends the uploads directory
    // and keeps only the "likely" required keys for future processing.
    getFileNames: function ( files ) {
        // Retrieve all files original name and new server name
        var keys = [ 'originalname', 'filename','destination'];
        var uploadedFiles = _.map( files, obj => _.pick(obj, keys) );
        
        // Append uploads directory.
        _.forEach( uploadedFiles, function(f ){ 
            _.update(f, 'filename', obj => f.destination + "/" +  f.filename);
        });
        return uploadedFiles;
    }
};