var i18n = require("i18n");

/* Setup potential for multiple languages, mostly likely only relevant for the questionnaires
   res.__(KEYWORD) will translate if KEYWORD exists in whatever the locale language is

   Change lanaguage is setup via /lang
   Only English and French setup below
*/

module.exports = function (app) {

    app.get('/', function(req,res, next) {
        console.log( res.__("Test Me") );
        next();
    });

    app.get('/en', function(req,res) {
        res.cookie('i18n','en');
        res.redirect('/');
    });

    app.get('/fr', function(req,res) {
        res.cookie('i18n','fr');
        res.redirect('/');
    });
}