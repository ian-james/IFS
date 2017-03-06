const fs = require('fs');
var natural = require('natural');
var sentTok = new natural.SentenceTokenizer();
var wordTok = new natural.WordTokenizer();

function Position()
{
    this.charNum = 0; //Global
    this.wordNum = 0; //Relative    
    this.lineNum = 0; //Global
    this.charPos = 0; //Relative Character position per line.
    this.wordPos = 0;
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
            this.sentences = this.content.match(/[^\.!\?\n]+/g);

            console.log("******************** HERE ");
            this.fileInfo.numLines = this.sentences.length;

            console.log("************************************************** SENT", this.sentences.length );

            var sum = 0;
            this.fileInfo.charCount.push( sum );
            for( var i = 0; i < this.sentences.length;i++ ) {
                sum += (this.sentences[i].length+1); // This add one space, which might not be right.
                console.log("s->", this.sentences[i]);
                 console.log("**************************************************sum",i, " =", sum);

                this.fileInfo.charCount.push( sum );
                var w = this.wordTokenizer.tokenize( this.sentences[i] )
                this.fileInfo.wordCount.push(  w.length );
                this.fileInfo.totalWords += w.length ;
/*
                if( i+1 == this.sentences.length ){
                    // PARSER BUG: Might not pick up last line of text if not properly punctutated.
                    if( sum+this.sentences.length < this.content.length) {
                        var lastSentence = this.content.substr( sum + this.sentences.length);
                        this.sentences.push( lastSentence );
                        this.fileInfo.numLines++;
                    }
                }
*/
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

        console.log("A-B:", a.target, " :", b.target);
        console.log("A-LW:", a.lineNum, " ", a.wordNum );
        console.log("B-LW:", b.lineNum, " ", b.wordNum , "\n");
        return a.wordNum == b.wordNum && a.lineNum == b.lineNum;
    }

    this.validCharPos = function ( position ) {
        if( this.hasCh(position) )
            return position.charNum >= 0 && position.charNum < this.fileInfo.charCount[ this.fileInfo.numLines ];
        return false;
    };

    this.validLineNum = function (position) {
        console.log("HL ->",  this.hasLine(position) );
        if( this.hasLine(position) ) {
            //console.log("PLN", position.lineNum,  " < ", this.fileInfo.numLines );
            return  position.lineNum < this.fileInfo.numLines && position.lineNum >= 0;
        }
        return false;
    };

    this.validWordNum = function (position) {
        console.log("WN ->",  this.hasWord(position) );
        if( this.hasWord(position) ) {
            if( this.validLineNum( position ) ) {
                //console.log("PLW", position.wordNum,  " < ",  this.fileInfo.totalWords );
                return position.wordNum >=0  && position.wordNum <= this.fileInfo.totalWords;
            }
        }
        return false;
    };

    // Assumes line and word
    this.calcCharPos = function( position ) {
        //console.log( "HT", this.hasTarget(position) );
        //console.log("VWN", this.validWordNum(position) );
        if(  this.hasTarget( position ) && this.validWordNum(position) ) {
            //console.log("Checking char pos ");
            console.log("F1", this.fileInfo.charCount[ position.lineNum ] );
            console.log("F2", this.sentences[ position.lineNum ].indexOf( position.target ) );
            return this.fileInfo.charCount[ position.lineNum ] + this.sentences[ position.lineNum ].indexOf( position.target );
        }
        return -1;
    };

    // Straight forward Get
    this.getCharNum = function( position ) {
        return position.charNum;
    }

    this.getCharNumFromLineNumCharPos = function ( position ) {
        console.log("I1-", position.lineNum,  " ",this.fileInfo.charCount[ position.lineNum ]);
        console.log("I2",position.charPos);
        return this.fileInfo.charCount[ position.lineNum ] + position.charPos;
    }



    /*
    this.locationExists = function( position ) {
        var res = false;
        if( !position || !this.fileInfo.isSet() )
            return res;

        return this.validCharPos( position ) || this.validWordNum( position );
    };

    this.wordInLine = function( position )  {
        if( this.validLineNum(position) ) {
            var words = this.wordTokenizer.tokenizer( this.sentences[position.lineNum] ) ;
            return words.indexOf(position.target);
        }
        return -1;
    };


    this.getWordAtPos = function( position ) {
        if( this.validWordNum( position ) ){
            var words = this.wordTokenizer.tokenizer( this.sentences[position.lineNum] );
            return words.length < position.wordNum ? words[position.wordNum] : "";
        }
        return "";
    };

    this.getLine = function( position ) {
        if( this.validLineNum(position ) )
                return this.sentences[ position.lineNum ];
        return "";
    };

    this.find = function( target ) {
        if( this.hasPos( target) && this.hasTarget(target) )
            return getWordAtPos(position) == target.target;
        return false;
    };
    */
}

module.exports.FileParser = FileParser;