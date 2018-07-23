/* Note most functions have not been tested in depth.
   Note: SentenceTokenizer() has a bug that skipps any lines without punctutation
        Such as blank lines or if the last line doesn't have a punct.

        I've used a simple regex that seems to match python for splitting up the file.

        Regex requires char position as this seems to be the most / only accurate method
        of replacing things and quickly.

        if you tool doesn't have charNum, then it should have lineNum and charPos.

        wordNum  or lineNum, wordPos could also be used to calculate charNum but
        would need to be careful of duplicate words in the same area or sentence.

    Note:
       Position values with *Num are global counted from the start of the file.
       Otherwise they're relative to the start of the sentence.

    NOTE: THis file should be separted remove functionality from Position "Interface".
*/

/**
 * Writing Parser
 * Pretty much a 1:1 version of the  fileParser.
 * Just cleaned up
 */

const fs = require('fs');
var natural = require('natural');
var sentTok = new natural.SentenceTokenizer();
var wordTok = new natural.WordTokenizer();

/**
 * A Position Class.
 */
function Position() {
    // Globals
    this.charNum = 0;
    this.wordNum = 0;
    this.lineNum = 0;

    // Relative
    this.charPos = 0; 
    this.wordPos = 0;
}
/**
 * A FileInfo Class.
 */
function FileInfo() {
    this.numLines = 0;
    this.charCount = [];
    this.wordCount = [];
    this.totalWords = 0;

    /**
     * isSet
     * Description: Checks to make sure the number of lines isnt 0.
     * @return {boolean}
     */
    this.isSet = function() {
        return this.numLines != 0;
    };
}

/**
 * FileParser
 * A simple WritingParser Class.
 */
function WritingParser() {
    this.senTokenizer = sentTok;
    this.wordTokenizer =  wordTok;
    this.file = "";
    this.content = "";
    this.sentences = [];

    this.location = new Position();
    this.fileInfo = new FileInfo();

    /**
     * setup
     * Sets up the file
     * @param {string} filename 
     */
    this.setup = function(filename) {
        this.file = filename;
    };

    /**
     * setupContent
     * Sets up the content
     * @param {string} content 
     */
    this.setupContent = function( content ) {
        this.content = content;
    }

    /**
     * isReady
     * Checks to make sure the file and content are empty.
     * @return {boolean}
     */
    this.isReady = function() {
        return this.file != "" && this.content != "";
    };

    /**
     * readFile
     * Reads the file and sets content equal to it
     * @return {boolean}
     */
    this.readFile = function ( ) {
        if( this.file )
            this.content = fs.readFileSync( this.file, 'utf-8');
        return this.content == "";
    };

    /**
     * tokenize
     * Tokenizes the string
     */
    this.tokenize = function() {
        if( this.content == "")
            this.readFile();

        if( this.content ) {
            /* Note that this tokenizer has to align wi the method of tokenization in the tool,
               which is not ideal, but this seems to match what python does by default.
            */
            this.sentences = this.content.split(/\r?\n/);

            this.fileInfo.numLines = this.sentences.length;
            var sum = 0;
            this.fileInfo.charCount.push( sum );
            for( var i = 0; i < this.sentences.length;i++ ) {
                sum += (this.sentences[i].length+1); // This add one space, which might not be right.

                this.fileInfo.charCount.push( sum );
                var w = this.wordTokenizer.tokenize( this.sentences[i] )
                this.fileInfo.wordCount.push(  w.length );
                this.fileInfo.totalWords += w.length ;
            }
        }
    };

    // Interface
    this.hasCh = function(obj) { return obj.hasOwnProperty('charNum'); };
    this.hasWord = function(obj) { return obj.hasOwnProperty('wordNum'); };
    this.hasLine= function(obj) { return obj.hasOwnProperty('lineNum'); };
    this.hasWordPos = function(obj) { return obj.hasOwnProperty('wordPos'); };
    this.hasCharPos = function(obj) { return obj.hasOwnProperty('charPos'); };
    this.hasPos = function(obj) { return obj.hasOwnProperty('position'); };
    this.hasTarget= function(obj) { return obj.hasOwnProperty('target'); };


    /**
     * atSameLineWord
     * Checks to make sure two objects are at the same word number.
     * @param {object} a 
     * @param {object} b 
     * @return {boolean}
     */
    this.atSameLineWord = function(a,b) {
        return a.wordNum == b.wordNum && a.lineNum == b.lineNum;
    }

    /**
     * validCharPos
     * Checks to make sure a character is within the scope 
     * @param {object} position 
     * @return {boolean}
     */
    this.validCharPos = function ( position ) {
        if( this.hasCh(position) )
            return position.charNum >= 0 && position.charNum < this.fileInfo.charCount[ this.fileInfo.numLines ];
        return false;
    };

    /**
     * validLineNum
     * Checks to make sure that a line number is within the scope.
     * @param {object} position 
     * @return {booelan}
     */
    this.validLineNum = function (position) {
        if( this.hasLine(position) ) {
            return  position.lineNum <= this.fileInfo.numLines && position.lineNum >= 0;
        }
        return false;
    };

    /**
     * validWordNum
     * Checks to make sure that a word is within the scope.
     * @param {object} position 
     * @return {boolean}
     */
    this.validWordNum = function (position) {
        if( this.hasWord(position)  && this.validLineNum( position ) ) {
                return position.wordNum >=0  && position.wordNum <= this.fileInfo.totalWords;
        }
        return false;
    };

    /**
     * getCharNum
     * Fetches the char num of a given position.
     * @param {object} position 
     * @return {integer}
     */
    this.getCharNum = function( position ) {
        return position.charNum;
    };

    // External Tool: assumes -1 for lineNum
    /**
     * getCharNumFromLineNumCharPos
     * Gets the char number from the line number and character position.
     * @param {object} position 
     * @return {integer}
     */
    this.getCharNumFromLineNumCharPos = function ( position ) {
        if( position.lineNum-1 <0 )
            return -1;
        return this.fileInfo.charCount[ position.lineNum-1 ] + (position.charPos ? position.charPos : 0 );
    };

    /**
     * getLine
     * Returns the line given a position.
     * @param {object} position 
     * @param {boolean} is0Based 
     * @return {string}
     */
    this.getLine = function( position, is0Based = true ) {
        if( this.validLineNum(position ) ) {
                if(position.lineNum - 1 < 0)
                    return "";

                return this.sentences[ position.lineNum -1];
        }
        return "";
    };

    /**
     * getLineI
     * Returns a line given a number.
     * @param {integer} i 
     * @param {boolean} is0Based
     * @return {string}
     */
    this.getLineI = function( i, is0Based = true ) {
        if( i < this.fileInfo.numLines && i >= 0 ) {
            var ni = is0Based ? i-1 : i;
            return this.sentences[ ni ];
        }
        return "";
    };

    /**
     * This function gets from a postion till the end of the line.
     * @param  {[Object]} position - contains the interface terms
     * @return {[string]}          empty or a section of a line of text
     */
    this.getLineSection = function( position ) {
        var line = this.getLine(position);
        if( line != "" && this.hasCharPos(position) ) {
            return this.getLineSectionEnd(line, position.charPos);
        }
        return line;
    };

    /**
     * getLineSectionEnd
     * Gets the end of a line section.
     * @param {integer} line 
     * @param {integer} start 
     * @param {integer} end 
     * @return {string}
     */
    this.getLineSectionEnd = function( line, start, end = -1 ) {
        var s = Math.min(start,line.length);
        if( end >= 0 ) {
            return line.substr( s, end  );
        }
        return line.substr( s );
    }

    /**
     * getRange
     * Gets a range given a position.
     * @param {object} position 
     * @return {string}
     */
    this.getRange = function( position ) {
        if( position.hasOwnProperty('hlBeginChar') && position.hasOwnProperty('hlEndChar') &&
            position.hasOwnProperty('hlBeginLine') && position.hasOwnProperty('hlEndLine') ) {

            // IF one same line, just return substr
            // else add until finishe

            var bch = position.hlBeginChar, bline = position.hlBeginLine;
            var ech = position.hlEndChar, eline = position.hlEndLine;

            var line = this.getLine(position);
            // If errors is on the same line, get the section of code
            if( bline == eline ) {
                return this.getLineSectionEnd(line,bch,ech-bch);
            }
            else {
                // Errors spans multiple lines.

                var target = this.getLineSectionEnd(line, bch);

                for( var i = bline+1; i<=eline; i++) {
                    line = this.getLineI(i);

                    if( i == ech) {
                        target += this.getLineSectionEnd(line,0,ech);
                    }
                    else
                        target += line;
                }
                return target;
            }
        }
        return "";
    }
}

module.exports.WritingParser = WritingParser;
