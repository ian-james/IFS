// Middleware Sections ( Standard inclusion with Node/Express server)

module.exports = function (app) {

    // Add middleware for view Engine (Jade/Pug)
    app.set( 'view engine', 'pug');

    // A logging middleware 
    // Winston Middleware but customized
    var configPath = __dirname + "/";
    var myLogger = require( __configs + "loggingConfig");

    var logger = require('morgan')("combined", {"stream": myLogger.stream } );
    app.use( logger );

    /* Note the odd separation of some of these middleware is a required
        CookieParser, i18n, bodyParser and passport all interact the request message.
     */

    var cookieParser = require('cookie-parser');

     //i18n
    var i18n = require("i18n");
    i18n.configure({
        locales:['en','fr'],
        defaultLocale: 'en',
        cookie: 'i18n',
        queryParameter: 'lang',
        directory: './languages'
    });

    app.use(cookieParser('ifsSecretSessionInfo'));

    // Parses incoming requests  ( not multipart)
    // NOTE: This works with passport but I'm not sure multer does...might have a small conflict.
    var bodyParser = require('body-parser');
    app.use( bodyParser.json() );
    app.use( bodyParser.urlencoded({extended: false}) );

    // Middleware to over routes
    var methodOverride = require("method-override");
    app.use( methodOverride() );

    // Passport included
    var passport = require('passport');

    // Express-sessional information
    var session = require('express-session');
    app.use( session({
        secret: 'ifsSecretSessionInfo',
        resave: true,
        saveUninitialized: true,
        cookie: {maxAge:60*60*1000}
        })
    );

    app.use( i18n.init );

    // Setup Flash messages
    var flash = require('express-flash');
    app.use(flash());

    //Require passport routes
    require( "./passport") (passport);

    app.use( passport.initialize() );
    app.use( passport.session());
}