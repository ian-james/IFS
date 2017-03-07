var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require('fs');
var _ = require('lodash');

module.exports = function( app ) {

    app.get('/summary', function(req, res, next ){

        var msg = "";
        var files = [];
        if( req.session.allFeedbackFile ) {
            try {
                var file = req.session.allFeedbackFile;
                var feedback = fs.readFileSync( file , 'utf-8');
                var jdata = JSON.parse( feedback );

                if(jdata && jdata.feedback && jdata.feedback.visual) {

                    var visualArr = jdata.feedback.visual;
                    for( var i= 0; i < visualArr.length; i++ )
                    {
                        if( visualArr[i].tool  == "textSummarization" ) {
                            var obj = { 'originalname': visualArr[i].originalname, 'summary':  visualArr[i].sentences.join(' ') }
                            files.push(obj);
                        }
                    }
                }
            }
            catch( e ) {
                msg = "Unable to produce a text summary";
            }
        }

        res.render( viewPath + "textSummary", { title: "Text Summary", files:files, msg: msg });
    });
};