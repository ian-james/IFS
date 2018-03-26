var fs = require('fs');
var sort = require('vfile-sort');
const commandLineArgs = require('command-line-args');

/* Options are 
    File
    List of relevant plugins from:
        https://github.com/retextjs/retext/blob/master/doc/plugins.md
        var cliches = require('retext-cliches');
        var contractions = require('retext-contractions');
        var diacritics = require('retext-diacritics');
        var equality = require('retext-equality');
        var indefiniteArticle = require('retext-indefinte-article');
        var keywords = require('retext-keywords');
        var overuse = require('retext-overuse');
        var passive = require('retext-passive');
        var profanities = require('retext-profanities');
        var readability = require('retext-readability');
        var redudantAcronyms = require('retext-redundant-acronyms');
        var repeatedWords = require('retext-repeated-words');
        var sentenceSpacing = require('retext-sentence-spacing');
        var sentitment = require('retext-sentiment');
        var simplify = require('retext-simplify');
        var spell  = require('retext-spell');
        var usage  = require('retext-usage');
        var quotes  = require('retext-quotes');
    Groups Names for plugins
*/
const optionDefintion = [
    { name: 'file', alias: 'f', type: String },
    //{ name: 'retext-cliches', alias: 'a', type: Boolean },
    { name: 'retext-contractions', alias: 'b', type: Boolean },
    { name: 'retext-diacritics', alias: 'c', type: Boolean },
    { name: 'retext-equality', alias: 'd', type: Boolean },
    { name: 'retext-indefinite-article', alias: 'e', type: Boolean },
    { name: 'retext-keywords', alias: 'g', type: Boolean },
    { name: 'retext-overuse', alias: 'h', type: Boolean },
    { name: 'retext-passive', alias: 'i', type: Boolean },
    { name: 'retext-profanities', alias: 'j', type: Boolean },
    { name: 'retext-readability', alias: 'k', type: Boolean },
    { name: 'retext-redundant-acronyms', alias: 'l', type: Boolean },
    { name: 'retext-repeated-words', alias: 'm', type: Boolean },
    { name: 'retext-sentence-spacing', alias: 'n', type: Boolean },
    { name: 'retext-sentiment', alias: 'o', type: Boolean },
    { name: 'retext-simplify', alias: 'p', type: Boolean },
    //{ name: 'retext-spell', alias: 'q', type: Boolean }, // Requires a dictionary
    //{ name: 'retext-usage', alias: 'r', type: Boolean },
    { name: 'retext-quotes', alias: 's', type: Boolean },
    { name: 'syntax', alias: 'x', type: Boolean },
    { name: 'begood', alias: 'y', type: Boolean },
    { name: 'improve', alias: 'z', type: Boolean }
]

const options = commandLineArgs(optionDefintion);
var _ = require('lodash');

function getSubstr( str, sTarget, eTarget )
{
    var first = str.indexOf(sTarget);
    if(first >= 0) {
        var second = str.indexOf(eTarget,first+1);
        if( !second )
            return null;
        return str.substr( first+1, second-first-1);
    }
    return null;
}

function main( opts )
{
    var file = _.get(opts,'file',""); 
    if( file.length == 0 ){
        console.error("Mean Writer is unable to locate the file.");
        return 0;
    }

    fs.readFile( file, (err,data)=> {

        if( err ) {
            console.error("Mean Writer is unable to process the file.");
            return 0;
        }

        var retext = require('retext');
        retext = retext().use( [ require("retext-english") ] );
        var keys = _.keys(opts);
        _.forEach( keys, function( opt ){
            if( _.startsWith(opt, "retext-") ){
                retext = retext().use( require( opt));
            }
            if( opt == 'syntax'){
                retext = retext().use( require('retext-contractions') );
                retext = retext().use( require('retext-diacritics') );
                retext = retext().use( require('retext-indefinite-article') );
                retext = retext().use( require('retext-quotes') );
                retext = retext().use( require('retext-simplify') );
                //retext = retext().use( require('retext-spell') );
                retext = retext().use( require('retext-sentence-spacing') );
            }
            if( opt == 'begood')
            {
                retext = retext().use( require('retext-profanities') );
                retext = retext().use( require('retext-equality') );
                retext = retext().use( require('retext-sentiment') );
            }
            if( opt == 'improve')
            {
                //retext = retext().use( require('retext-cliches') );
                retext = retext().use( require('retext-keywords') );
                retext = retext().use( require('retext-overuse') );
                retext = retext().use( require('retext-passive') );
                retext = retext().use( require('retext-redundant-acronyms') );
                retext = retext().use( require('retext-repeated-words') );
                //retext = retext().use( require('retext-usage') );
                retext = retext().use( require('retext-readability') );
            }
        })
   
        var report = require('vfile-reporter');

        retext.process(data, function(err, rfile) {
            var ifsVersion = {  };
            try
            {
                sort(rfile);
                var feedback = [];
                var messages = _.get(rfile,"messages");
                _.forEach( messages, function( m )
                {
                    //console.log("M Was ", m);
                    // Target needs to be parsed to a odd format.
                    // Note sure if it's consistent between al retext tools yet.
                    var target = _.get(m,"message");

                    var loc = _.get(m,"location");
                    var obj = {};
                    obj["target"] = _.get(m,"actual", "") || ( getSubstr(target,"\“", "\”") || getSubstr(target,"\`","\`"));
                    //obj["charPos"] = _.get(loc,"start.column")
                    obj["charNum"] = _.get(loc,"start.offset")
                    obj["lineNum"] = _.get(loc,"start.line");
                    obj["hlBeginChar"] = _.get(loc,"start.offset")
                    obj["hlBeginLine"] = _.get(loc,"start.line");
                    obj["hlEndChar"] = _.get(loc,"end.offset")
                    obj["hlEndLine"] =_.get(loc,"end.line");
                    obj["lang"] = "English";
                    obj["type"] = _.get(m,"source","").replace("retext-","");
                    obj["toolName"] = "Retext";
                    obj["filename"] = file;
                    obj["feedback"] = _.get(m,"reason");
                    obj["severity"] = _.get(m,"fatal","warning");
                    obj["suggestions"] = _.get(m,"expected") ? _.get(m,"expected") : "";
                    feedback.push(obj);
                });

                ifsVersion = { "feedback": feedback };
                var ifsStr = JSON.stringify(ifsVersion);
                console.log( ifsStr );
            }
            catch(err){
                console.error("{Error:{msg:\"Unable to use tools.\"}}");
            }
        });
    });
}

main(options);