// Create the express app
var express = require('express');
var app = express();
var http = require('http');

//var compression = require('compression');
//app.use(compression());

if(app.get('env') === 'production'){
    console.log("In PRODUCTION");
}

// Set our paths for finding our code.
var path = require('path');
//var appPath = path.join( __dirname + "/../app/");
//var componentsPath = path.join( appPath + "/components");
//
global.__base =  path.join(__dirname, "../");
global.__configs = path.join(__dirname, "/");

global.__tools = path.join(__dirname , "../tools/");
global.__components = path.join(__dirname, "../app/components/");
global.__appPath = path.join(__dirname, "../app/");
global.__EXPERIMENT_ON = true;

var port = process.env.PORT || 3000;
// Set App variables.
app.set('port', port);
app.set('case sensitive routing', true);
app.set('strict routing', false);
app.set('x-powered-by', false); // don't publicize the server information
app.set( 'view engine', 'pug');

// Add path information
require("./addResourcePaths.js")(app);

// A logging middleware 
// Winston Middleware but customized
var dbcfgPath = __dirname + "/";
var myLogger = require( __configs + "loggingConfig");

if( app.get('env') != "test" ) {
    var logger = require('morgan')("combined", {"stream": myLogger.stream } );
    app.use( logger );
}

// This section creates our session store data, it is outside the other add* requires because it is shared.
var redisOpts = require( __components  + "/Queue/kuaServerConfig").testKue;
var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);
var client = redis.createClient();

var sessionInfo =  {
    key: 'express.sid',
    secret: 'ifsSecretSessionInfo',
    resave: true,
    store: new redisStore({
        host:'localhost',
        port: redisOpts.kueOpts.redis.port,
        client: client
    }),
    saveUninitialized: true,
    cookie: {
        maxAge:30*60*1000,
        httpOnly: false
    }
}

var mySession =  session(sessionInfo);

var cookieParser = require('cookie-parser');

app.use(cookieParser(sessionInfo.secret));

var passport = require('passport');

var methodOverride = require("method-override");
app.use( methodOverride() );

var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: false}) );

app.use(mySession);

// Setup Flash messages
var flash = require('express-flash');
app.use(flash());


//Require passport routes
require( "./passport") (passport);
app.use( passport.initialize() );
app.use( passport.session() );

// Add middleware 
//require("./addMiddleware.js") (app,mySession);

var server = http.Server(app);
var io = require('socket.io')(server,{'transports':['polling', 'websocket'], pingInterval:25000,pingTimeout:60000});

var passportSocketIO = require('passport.socketio');

function onAuthorizeSuccess(data, accept){
  // The accept-callback still allows us to decide whether to
  // accept the connection or not.
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){

  console.log("onAuthoFailM-", message);
  if(error)
    throw new Error(message);
  // We use this callback to log all of our failed connections.
  console.log('failed connection to socket.io:', message);
  accept(null, false);  
}


io.use( passportSocketIO.authorize({
        key: 'express.sid',
        cookieParsser: cookieParser,
        secret: sessionInfo.secret,
        store: sessionInfo.store,
        passport: passport,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail,
    }
));

// Add Emit Routes
require("./serverSocketIO.js")(app,io);

// Add Developer Routes
require("./addRoutes.js")(app, io);

// Error handling in common format (err,req,res,next)
var errorHandler = require('errorhandler');
if(app.get('env') === 'development'){
    app.use(errorHandler());
}

// Start the app listening
var processPort = process.env.NODE_APP_INSTANCE || 0;
server.listen(parseInt(app.get('port')) + parseInt(processPort), function() {
    console.log("Listening on port " + app.get('port'));
});
