var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var unzip = require('unzip');
var _ = require('lodash');

var Logger = require( __configs + "loggingConfig");

module.exports =  {

   /* Helper functions */
    getYearMonthDayStr:function (){
        var dateObj = new Date();
        var arr = [ dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()];
        return arr.join('-');
    },

    replaceExt: function( filename, newExt ) {
      var ext = path.extname(filename);
      return filename.replace(ext, newExt);
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

    /* Wrapper for all file types handling
        Function should take files array (containing basic info for each file)
        Check that unzipping and conversions can function
        update file names to appropritate names (doc changes to text)
        otherwise leave file information unchanged.
        Note: You can/should only handle the fileInfo once.
    */
    handleFileTypes: function( filesInfo )
    {
        for( var i = 0; i < filesInfo.length; i++)
        {
            var fileInfo = filesInfo[i];
            var res = this.handleZipFile( fileInfo );
            if( 'err' in res ) {
                // TODO: we need to stop
                return res;
            }
            else if( 'res' in res ) {
                //  file was handled
                fileInfo = res.res;
            }
            res = this.handleDocxFile( fileInfo );
            if( 'err' in res ) {
                // TODO: we need to stop
                return res;
            }
            else if( res['res'] ){
                //  file was handled
                fileInfo = res.res;

            }
        }
        return filesInfo;
    },

    handleZipFile: function ( fileInfo )
    {
        var res = {};
        var zipfile = fileInfo.filename;
        if( zipfile && this.isZip(zipfile) ){

            //TODO: This has only been tested with zip.
            try {
                var stream = fs.createReadStream(zipfile);
                stream.on('error', function(error) {
                    Logger.error("Error caught error reading", error);
                });
                stream.pipe(unzip.Extract( {path: path.dirname(zipfile)} ) );

                //TODO, do we create jobs for each of these?
                // For now just return the same object
                res = { res:fileInfo };
            }
            catch(err) {
                var emsg =  "Unable to unzip: " + fileInfo.originalname;
                Logger.error(emsg);
                res.err = { msg:emsg };
            }
        }
        return res;
    },

    // This function takes the isDoc type and creates a .txt file with the same name
    // and in the same folder.
    // (TODO) Error is logged but not handled.
    handleDocxFile: function ( fileInfo )
    {
        var res = {};
        var filename = fileInfo.filename;
        if( filename && this.isDoc(filename) )
        {
            var childProcess = require('child_process');
            var outDir = path.dirname(filename);
            var args =  [ "--headless", "--convert-to","txt:Text", filename, '--outdir', outDir ];

            // This call soffice (Libra to handle conversion)
            var convertToTxt = childProcess.spawnSync('soffice', args );

            if(convertToTxt.error) {
                var emsg =  "Unable to convert document file: " + fileInfo.originalname;
                Logger.error(emsg);
                res.err = { msg:emsg };
            }
            else {
                // Make the text file the reference file instead of .doc
                fileInfo.filename = this.replaceExt(fileInfo.filename, ".txt");
                fileInfo.originalname = this.replaceExt(fileInfo.originalname, ".txt");
                res = { res: fileInfo };
            }
        }
        return res;
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
    },

    writeResults: function( obj, options ) {
        var filename = options.file;
        var uploadDir = path.dirname(  options.filepath );
        var file = path.join(uploadDir,filename);
        Logger.info("Writing", file, "now", file);
        fs.writeFileSync( file , JSON.stringify(obj), 'utf-8');
        return file;
    }
};