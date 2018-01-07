var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var _ = require('lodash');
const execSync = require('child_process').execSync;

var Logger = require(__configs + "loggingConfig");
var Errors = require(__components + "Errors/errors");

module.exports = {
    /* Helper functions */
    getYearMonthDayStr: function() {
        var dateObj = new Date();
        var arr = [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()];
        return arr.join('-');
    },

    replaceExt: function(filename, newExt) {
        var ext = path.extname(filename);
        return filename.replace(ext, newExt);
    },

    getExt: function(filename) {
        if (!filename)
            return "";

        var extId = filename.lastIndexOf(".");
        return (extId >= 0 ? filename.substr(extId + 1) : "");
    },

    // This checks .zip, .tar and .gz files
    isZip: function(filename) {
        var ext = path.extname(filename);
        return ext == ".zip" || ext == ".tar" || ext == '.gz';
    },

    // This checks .odt, .docx and .doc  files
    isDoc: function(filename) {
        var ext = path.extname(filename);
        return ext == ".doc" || ext == ".docx" || ext == '.odt';
    },

    // This checks for .pdf files
    isPdf: function(filename) {
        var ext = path.extname(filename);
        return ext == ".pdf";
    },

    isSrcExt: function(filename) {
        var ext = ["c", "cpp", "cc", "cxx", "h", "hpp"];
        return _.includes(ext, this.getExt(filename));
    },

    validateProgrammingFiles: function(filesInfo) {
        // Check only one file for zip submission
        var countZip = 0, countSrc = 0;
        for (var i = 0; i < filesInfo.length; i++) {
            if (this.isZip(filesInfo[i].filename))
                countZip++;
            else if (this.isSrcExt(filesInfo[i].filename))
                countSrc++;
        }

        if (countZip > 1 || (countZip == 1 && filesInfo.length > 1)) {
            return Errors.cLogErr("Invalid submission: submit only one zipped project file.");
        }

        if (countZip == 0 && countSrc == 0)
            return Errors.cLogErr("Invalid submission: submit at least one source file.");
        return {};
    },

    validateWritingFiles: function(filesInfo) {
        //TODO Nothing for now
        return {};
    },

    // This function mimicks what would happen if students submitted via a zip file.
    // Place everything in another folder, could eventually even move certain files
    // to appropriate directories (if needed)
    createProgrammingProject: function(filesInfo, options) {
        if (filesInfo.length >= 1) {
            options = options || {
                'dir': '/unzipped'
            };
            var directory = filesInfo[0].destination;
            var zipDir = path.join(directory, options['dir']);
            var folderCreated = mkdirp.sync(zipDir);
            Errors.cl(folderCreated);

            if (folderCreated) {
                try {
                    for (var i = 0; i < filesInfo.length; i++) {
                        var call = "mv " + filesInfo[i].filename + " " + zipDir
                        execSync(call);
                    }

                    // These will point to the directory and be handled later.
                    // Destroy the original array and replace with a single instance to directory.
                    filesInfo = [{
                        'filename': zipDir,
                        'originalname': zipDir,
                        'destination': directory,
                        'path': 'directory',
                    }];
                    return filesInfo;
                } catch (e) {
                    return Errors.cErr("Cannot copy provided source files.");
                }
            } else {
                Errors.cl(zipDir);
                return Errors.cErr("Cannot create directory for programming project.");
            }
        }
    },

    /* Wrapper for all file types handling
        Function should take files array (containing basic info for each file)
        Check that unzipping and conversions can function
        update file names to appropritate names (doc changes to text)
        otherwise leave file information unchanged.
        Note: You can/should only handle the fileInfo once.
    */
    handleFileTypes: function(req, res) {
        // Get files names to be inserted
        var uploadedFiles = this.getFileNames(req.files);

        if (!uploadedFiles || uploadedFiles.length == 0) {
            var e = Errors.cLogErr("Unable to process uploaded file(s). Only Office, PDF, and text documents are accepted.");
            if (req.session.toolSelect == "Programming") {
                e = Errors.cLogErr("Unable to process uploaded file(s). Only tar/zipped projects and .c or .h files are accepted.");
            }
            return e;
        }

        var toolType = req.session.toolSelect;
        if (toolType == "Programming") {
            var validate = this.validateProgrammingFiles(uploadedFiles);
            if (Errors.hasErr(validate)) {
                Errors.logErr(validate);
                return validate;
            }

            var fileInfo = uploadedFiles[0];
            var res = this.handleZipFile(fileInfo);
            if (Errors.hasErr(res)) {
                // Could not handl zipped format.
                Errors.logErr(res);
                return res;
            } else if (_.has(res, 'res')) {
                // Get the directory information
                fileInfo = res.res;
            } else {
                uploadedFiles = this.createProgrammingProject(uploadedFiles);
            }
        } else if (toolType == "Writing") {
            var validate = this.validateWritingFiles(uploadedFiles);
            if (Errors.hasErr(validate)) {
                Errors.logErr(res);
                return validate;
            }
            for (var i = 0; i < uploadedFiles.length; i++) {
                var fileInfo = uploadedFiles[i];
                var ext = path.extname(fileInfo.originalname);
                if (ext == '.pdf') {
                    res = this.handlePdfFile(fileInfo);
                }
                else {
                    res = this.handleDocxFile(fileInfo);
                }
                if (Errors.logErr(res)) {
                    // TODO: we need to stop
                    Errors.logErr(res);
                    return res;
                } else if (_.has(res, 'res')) {
                    //  file was handled
                    fileInfo = res.res;
                }
            }
        }
        return uploadedFiles;
    },

    separateFiles: function(files, fileTypes) {
        var res = {}
        for (var i = 0; i < files.length; i++) {
            var ext = this.getExt(files[i]);
            if (_.includes(fileTypes, ext)) {
                if (_.includes(res, ext)) {
                    res[ext].push(files[i])
                } else
                    res[ext] = [files[i]];
            }
        }
        return res;
    },

    findFilesSync: function(startDir) {

        if (!fs.lstatSync(startDir).isDirectory()) {
            return Errors.cLogErr("Directory:" + startDir + " does not exist.");
        }

        var arr = [];
        var files = fs.readdirSync(startDir);
        for (var i = 0; i < files.length; i++) {
            var filename = path.join(startDir, files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()) {
                arr = arr.concat(this.findFilesSync(filename));
            } else
                arr.push(filename);
        }
        return arr;
    },

    handleZipFile: function(fileInfo) {
        var res = {};
        var zipfile = fileInfo.filename;
        if (zipfile && this.isZip(zipfile)) {

            // Temporary folder to unzip all content into then copying
            // C and header files to a clean directory for tool assessments.
            var tempZipDir = path.join(path.dirname(zipfile), '/tempUnzipped');
            try {
                var unarc = this.unarchive(zipfile, {
                    'dir': tempZipDir
                });
                if (Errors.ifErrLog(unarc)) {
                    return unarc;
                } else {
                    var files = this.findFilesSync(tempZipDir);
                    var fileGroups = _.groupBy(files, this.getExt);
                    if (fileGroups) {
                        var isValidProject = this.validateProjectStructure(fileGroups);
                        if (Errors.ifErrLog(isValidProject)) {
                            return isValidProject
                        }

                        var zipDir = path.join(path.dirname(zipfile), '/unzipped');
                        // Move all files types to directory
                        var fileTypes =  ["c", "cpp", "cc", "cxx", "h", "hpp"];
                        _.forOwn( fileGroups, function(value,key) {
                            if(fileTypes.indexOf(key) >= 0 )
                            {
                                var files = value;
                                for(var y = 0; files &&  y < files.length;y++) {
                                    var shortName = zipDir + "/" + path.basename(files[y]);
                                    fs.copy(files[y], shortName);
                                }
                            }
                        });
                        // These will not point to the initial directory.
                        fileInfo.filename = zipDir;
                        fileInfo.originalname = zipDir;
                        res = {
                            res: zipDir
                        };
                    }
                }
            } catch (err) {
                var emsg = "Unable to extract : " + fileInfo.originalname;
                Logger.error(err.name + ': ' + err.message);
                res.err = {
                    msg: emsg
                };
            }
        }
        return res;
    },

    // This function takes the isDoc type and creates a .txt file with the same name
    // and in the same folder.
    // (TODO) Error is logged but not handled.
    handleDocxFile: function(fileInfo) {
        var res = {};
        var filename = fileInfo.filename;
        if (filename && this.isDoc(filename)) {
            var childProcess = require('child_process');
            var outDir = path.dirname(filename);
            var args = ["--headless", "--convert-to", "txt:Text", filename, '--outdir', outDir];

            // This call soffice (Libra to handle conversion)
            var convertToTxt = childProcess.spawnSync('soffice', args);

            if (convertToTxt.error) {
                var e = Errors.cLogErr("Unable to convert document file: " + fileInfo.originalname);
                return e;
            } else {
                // Make the text file the reference file instead of .doc
                fileInfo.filename = this.replaceExt(fileInfo.filename, ".txt");
                fileInfo.originalname = this.replaceExt(fileInfo.originalname, ".txt");
                res = {
                    res: fileInfo
                };
            }
        }
        return res;
    },

    // This function takes the isPdf type and creates a .txt file with the same name
    // and in the same folder.
    // TODO Error is logged but not handled.
    handlePdfFile: function(fileInfo) {
        var res = {};
        var filename = fileInfo.filename;
        if (filename && this.isPdf(filename)) {
            var childProcess = require('child_process');
            var args = ["-layout", filename]
            //this is the call to pdftotext from poppler-utils
            var convertToTxt = childProcess.spawnSync('pdftotext', args);

            if (convertToTxt.err) {
                var e = Errors.cLogErr("Unable to convert PDF file: " + fileInfo.originalname);
                return e;
            } else {
                // Make he text file the reference file instead of the .pdf
                fileInfo.filename = this.replaceExt(fileInfo.filename, ".txt");
                fileInfo.originalname = this.replaceExt(fileInfo.originalname, ".txt");
                res = {
                    res: fileInfo
                };
            }
        }
        return res;
    },

    /* Function will un-archive a zip or gz file
       By Default: will create a new folder unzipped and extract to it.
    */
    unarchive: function(file, options) {
        options = options || {};
        options.dir = options.dir || "./unzipped";
        var res = {}
        try {
            var call = "";
            var folderCreated = false;
            var ext = this.getExt(file);
            if (ext == 'gz') {
                folderCreated = mkdirp.sync(options.dir);
                options.params = options.params || "-xzf";
                call = "tar " + options.params + " '" + file + "' -C " + options.dir;
            } else if (ext == 'tar') {
                folderCreated = mkdirp.sync(options.dir);
                options.params = options.params || "-xf";
                call = "tar " + options.params + " '" + file + "' -C " + options.dir;
            } else if (ext == 'zip') {
                folderCreated = true;
                options.params = options.params || " -q ";
                call = "unzip " + options.params + file + " -d " + options.dir;
            }
            if (folderCreated) {
                execSync(call);
            } else {
                throw Errors.cLogErr("Unable to unzip project archive.");
            }
        } catch (e) {
            var e = Errors.cLogErr("Unable to extract file(s): " + file);
            return e;
        }

        return {};
    },

    // Minor validation of the project, including checking for a makefile, *c and *.h files
    validateProjectStructure: function(zipDir, groupedFiles) {
        if (groupedFiles) {
            var programmingType = ["c", "cpp", "cc", "cxx", "h", "hpp"];
            var sum = 0;

            for(var i = 0; i< programmingType.length; i++) {
                sum += _.get(groupedFiles, programingType[i], 0 ).length;
            }
            if (!sum) {
                return Errors.cLogErr("Unable to locate source and/or headers files in project.");
            }
        }
        //Everything looks ok.
        return {};
    },

    // This function gets the file names from Multer, appends the uploads directory
    // and keeps only the "likely" required keys for future processing.
    getFileNames: function(files) {
        // Retrieve all files original name and new server name
        var keys = ['originalname', 'filename', 'destination'];
        var uploadedFiles = _.map(files, obj => _.pick(obj, keys));

        // Append uploads directory.
        _.forEach(uploadedFiles, function(f) {
            _.update(f, 'filename', obj => f.destination + "/" + f.filename);
        });
        return uploadedFiles;
    },

    writeResults: function(obj, options) {
        var filename = options.file;
        var uploadDir = path.dirname(options.filepath);
        var file = path.join(uploadDir, filename);
        Logger.info("Writing", file, "now", file);
        fs.writeFileSync(file, JSON.stringify(obj), 'utf-8');
        return file;
    },

    // This function mimicks the file object provided by Multer
    // If more fields are discovered to be useful just add them.
    createFileObject: function(filename) {
        return {
            'originalname': path.basename(filename),
            'filename': filename,
            'content': '',
        };
    }
};
