
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
            var supportedToolsFile = './tools/toolListProgramming.json';
            if( toolType == "Writing") {
                supportedToolsFile  = './tools/toolList.json';
                req.session.toolSelect = 'Writing';
                req.session.toolFile = supportedToolsFile;

            }
            else {
                req.session.toolSelect = 'Programming';
                req.session.toolFile = supportedToolsFile;
            }
        }
    }
};