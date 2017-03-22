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
*/

const fs = require('fs');
var natural = require('natural');
var sentTok = new natural.SentenceTokenizer();
var wordTok = new natural.WordTokenizer();

function Position()
{
    this.charNum = 0; //Global
    this.wordNum = 0; //Global
    this.lineNum = 0; //Global
    this.charPos = 0; //Relative Character position per line.
    this.wordPos = 0; // Relative
} 

function FileInfo()
{
    this.numLines = 0;
    this.charCount = [];
    this.wordCount = [];
    this.totalWords = 0;

    this.isSet = function() {
        return this.numLines != 0;
    };
}

function FileParser() {

    this.senTokenizer = sentTok;
    this.wordTokenizer =  wordTok;
    this.file = "";
    this.content = "";
    this.sentences = [];

    this.location = new Position();
    this.fileInfo = new FileInfo();

    this.setup = function(filename) {
        this.file = filename;
    };

    this.setupContent = function( content ) {
        this.content = content;
    }

    this.isReady = function() {
        return this.file != "" && this.content != "";
    };

    this.readFile = function ( ) {
        if( this.file )
            this.content = fs.readFileSync( this.file, 'utf-8');
        return this.content == "";
    };

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

    this.hasCh = function(obj) { return obj.hasOwnProperty('charNum'); };
    this.hasWord = function(obj) { return obj.hasOwnProperty('wordNum'); };
    this.hasLine= function(obj) { return obj.hasOwnProperty('lineNum'); };
    this.hasWordPos = function(obj) { return obj.hasOwnProperty('wordPos'); };
    this.hasCharPos = function(obj) { return obj.hasOwnProperty('charPos'); };
    this.hasPos = function(obj) { return obj.hasOwnProperty('position'); };
    this.hasTarget= function(obj) { return obj.hasOwnProperty('target'); };

    this.atSameLineWord = function(a,b) {
        return a.wordNum == b.wordNum && a.lineNum == b.lineNum;
    }

    this.validCharPos = function ( position ) {
        if( this.hasCh(position) )
            return position.charNum >= 0 && position.charNum < this.fileInfo.charCount[ this.fileInfo.numLines ];
        return false;
    };

    this.validLineNum = function (position) {
        if( this.hasLine(position) ) {
            return  position.lineNum < this.fileInfo.numLines && position.lineNum >= 0;
        }
        return false;
    };

    this.validWordNum = function (position) {
        if( this.hasWord(position)  && this.validLineNum( position ) ) {
                return position.wordNum >=0  && position.wordNum <= this.fileInfo.totalWords;
        }
        return false;
    };

    // Straight forward Get
    this.getCharNum = function( position ) {
        return position.charNum;
    };

    // External Tool: assumes -1 for lineNum
    this.getCharNumFromLineNumCharPos = function ( position ) {
        if( position.lineNum-1 <0 )
            return -1;
        return this.fileInfo.charCount[ position.lineNum-1 ] + (position.charPos ? position.charPos : 0 );
    };

    this.getLine = function( position, is0Based = true ) {
        
        if( this.validLineNum(position ) ) {
                if(position.lineNum - 1 < 0)
                    return "";

                return this.sentences[ position.lineNum -1];
        }
        return "";
    };  
}

module.exports.FileParser = FileParser;
