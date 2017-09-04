// Create the express app
var express = require('express');
var app = express();

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

var port = process.env.PORT || 3000;
// Set App variables.
app.set('port', port);
app.set('case sensitive routing', true);
app.set('strict routing', false);
app.set('x-powered-by', false); // don't publicize the server information

// Add path information
require("./addResourcePaths.js")(app);

// This section creates our session store data, it is outside the other add* requires because it is shared.
var redisOpts = require( __components  + "/Queue/kuaServerConfig").testKue;
var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);
var client = redis.createClient();

var mySession =  session({
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
});

// Add middleware 
require("./addMiddleware.js") (app,mySession);

// Start the app listening
const server = app.listen(app.get('port'), function() {
    console.log("Listening on port " + app.get('port'));
});

const socket_io = require('socket.io')(server).
                use(function(socket,next) {
                    mySession(socket.request, socket.request.res, next);
                });

// Add Emit Routes
require("./serverSocketIO.js")(app,socket_io);

// Add Developer Routes
require("./addRoutes.js")(app, socket_io);

// Error handling in common format (err,req,res,next)
var errorHandler = require('errorhandler');
if(app.get('env') === 'development'){
    app.use(errorHandler());
}
