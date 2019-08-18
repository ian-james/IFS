const appDefaults = require( __configs + "appDefaults.json" );
const configHelpers = require( __configs + "configHelpers.js" );


module.exports = {

/**
     * Default toolType setup (programming) Sets up session variables for
     *     default or DB loaded preferences
     * @param  {[type]} req      [description]
     * @param  {[type]} toolType [description]
     * @return {[type]}          [description]
     */
     setupDefaultTool: function(req, toolType) {
        //TODO: Move this to register and login pages.

        if( req.session ) {
            var supportedToolsFile = appDefaults.toolGenre.ProgrammingTools.toolListFile;
            if( configHelpers.isWriting(toolType) ) {
                supportedToolsFile  = appDefaults.toolGenre.WritingTools.toolListFile;
                req.session.toolSelect = appDefaults.writing;
                req.session.toolFile = supportedToolsFile;
            }
            else {
                req.session.toolSelect = appDefaults.programming;
                req.session.toolFile = supportedToolsFile;
            }
        }
    }
};