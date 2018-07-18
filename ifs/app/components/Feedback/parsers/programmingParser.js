/**
 * Programming parser
 * Updated from feedbackParser, to increase granularity.
 */

const fs = require('fs');
var natural = require('natural');
var sentTok = new natural.SentenceTokenizer();
var wordTok = new natural.WordTokenizer();

/**
 * FileInfo class
 */
function FileInfo() {
    this.numLines = 0;
    this.charCount = [];
    this.isSet = function() {
        return this.numLines != 0;
    }
}

/**
 * ProgrammingParser Class.
 */
function ProgrammingParser() {
    // Declare starting variables
    this.senTokenizer = sentTok;
    this.wordTokenizer =  wordTok;
    this.file = "";
    this.content = "";
    this.sentences = [];
    

    // Create instance of file info
    this.fileInfo = new FileInfo();

    /**
     * Sets up the filename
     * @param {string} filename 
     */
    this.setup = function(filename) {
        this.file = filename;
    };

    /**
     * Sets up the content
     * @param {string} content 
     */
    this.setupContent = function( content ) {
        this.content = content;
    }

    /**
     * Checks if we are ready to perform the functions
     */
    this.isReady = function() {
        return this.file != "" && this.content != "";
    };


    /**
     * Reads the file.
     */
    this.readFile = function ( ) {
        if( this.file )
            this.content = fs.readFileSync( this.file, 'utf-8');
        return this.content == "";
    };

    // Checks if it has a line
    this.hasLine = function(obj) { return obj.hasOwnProperty('lineNum'); };

    /**
     * Tokenizes the string and splits it by each line.
     */
    this.tokenize = function() {
        if( this.content == "")
            this.readFile();

        if( this.content ) {
            this.sentences = this.content.split(/\r?\n/);
            this.fileInfo.numLines = this.sentences.length;
        }
    };

    /**
     * Checks if the line is a valid line number
     * @param {integer} position 
     */
    this.validLineNum = function (position) {
        if( this.hasLine(position) ) {
            return  position.lineNum <= this.fileInfo.numLines && position.lineNum >= 0;
        }
        return false;
    };

    /**
     * Fetches the line.
     * @param {integer} position 
     * @param {boolean} is0Based 
     */
    this.getLine = function( position, is0Based = true ) {
        if( this.validLineNum(position ) ) {
                if(position.lineNum - 1 < 0)
                    return "";
                return this.sentences[ position.lineNum -1];
        }
        return "";
    };

    // External Tool: assumes -1 for lineNum
    this.getCharNumFromLineNumCharPos = function ( position ) {
        if( position.lineNum-1 <0 )
            return -1;
        return this.fileInfo.charCount[ position.lineNum-1 ] + (position.charPos ? position.charPos : 0 );
    };

    /**
     * Fetches line by call.
     * @param {integer} i 
     * @param {boolean} is0Based 
     */
    this.getLineI = function( i, is0Based = true ) {
        if( i < this.fileInfo.numLines && i >= 0 ) {
            var ni = is0Based ? i-1 : i;
            return this.sentences[ ni ];
        }
        return "";
    };

}

module.exports.ProgrammingParser = ProgrammingParser;