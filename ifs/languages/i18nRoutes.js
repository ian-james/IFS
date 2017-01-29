var i18n = require("i18n");

module.exports = function (app) {

    app.get('/', function(req,res, next) {
        res.setLocale(req.cookie.i18n || 'en');
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