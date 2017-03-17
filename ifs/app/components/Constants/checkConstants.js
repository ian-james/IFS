var Constants = require("./programConstants")

module.exports = function( ) {

    function isCSTool( selectedTool ) {
        return Constants.CS == selectedTool;
    }

    function isWritingTool( selectedTool ) {
        return Constants.PSY == selectedTool;
    }
}