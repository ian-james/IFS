var path = require('path');
var viewPath = path.join( __dirname + "/");

module.exports = function (app) {

// This just tests the i18n
     app.get('/question', function(req,res) {
        res.render(viewPath + "questionsLayout", { title: res.__('Question Screen'), test:res.__('Test Me')});
    })

/* Expected Routes are just copied and pasted */

    app.get('/addQuestion', function(req,res) {
        res.render(viewPath + "createQuestion", { title: res.__('Create Survey')} );
    });

    app.post('/addQuestion', function(req,res) {
        //To stuff
        //res.render(viewPath + "createSurvey", { title: res.__('Create Survey')} );
    });

    app.get('/editQuestion', function(req,res) {
        res.render(viewPath + "createQuestion", { title: res.__('Create Survey')} );
    });

    app.post('/editQuestion', function(req,res) {
        //To stuff
        //res.render(viewPath + "createSurvey", { title: res.__('Create Survey')} );
    });

    app.get('/deleteQuestion', function(req,res) {
        res.render(viewPath + "createQuestion", { title: res.__('Create Survey')} );
    });

    app.post('/deleteQuestion', function(req,res) {
        //To stuff
        //res.render(viewPath + "createSurvey", { title: res.__('Create Survey')} );
    });

   

/***************************End Question section******************************************/
    // Allow sellecting survey
    app.get('/survey', function(req,res) {
        //TODO
    });

    app.post('/survey', function(req,res) {
        //TODO;
    });

    app.get('/addSurvey', function(req,res) {
        res.render(viewPath + "createSurvey", { title: res.__('Create Survey')} );
    });

    app.post('/addSurvey', function(req,res) {
        //To stuff
        //res.render(viewPath + "createSurvey", { title: res.__('Create Survey')} );
    });
}