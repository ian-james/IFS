// Create the express app
var express = require('express');
var app = express();

// Set our paths for finding our code.
var path = require('path');
//var appPath = path.join( __dirname + "/../app/");
//var componentsPath = path.join( appPath + "/components");
//
global.__base =  path.join(__dirname, "../");
global.__configs = path.join(__dirname, "/");

global.__tools = path.join( __dirname , "../tools/");
global.__components = path.join( __dirname, "../app/components/");
global.__appPath = path.join( __dirname, "../app/");

var port = process.env.PORT || 3000;
// Set App variables.
app.set( 'port', port );

// Add path information
require( "./addResourcePaths.js")(app);

// This section creates our session store data, it is outside the other add* requires because it is shared.
var redisOpts = require( __components  + "/Queue/kuaServerConfig").testKue;
var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);
var client = redis.createClient();

var mySession =  session({
    secret: 'ifsSecretSessionInfo',
    resave: true,
    store: new redisStore( {
                            host:'localhost',
                            port: redisOpts.kueOpts.redis.port,
                            client: client,
                            ttl: redisOpts.ttl
                        }),
    saveUninitialized: true,
    cookie: {maxAge:30*60*1000}
});

// Add middleware 
require( "./addMiddleware.js") (app,mySession);

// Start the app listening
const server = app.listen( app.get('port') , function() {
    console.log( "Listening on port " + app.get('port'));
});

var event = require(__components + "InteractionEvents/buildEvent.js" );
var tracker = require(__components + "InteractionEvents/trackEvents.js" );

const socket_io = require('socket.io')(server).
                use(function(socket,next) {
                    mySession(socket.request, socket.request.res, next);
                });

socket_io.on('connection', (socket) => {

                    if(!(socket.request.session.passport && socket.request.session.passport.user )) {
                        socket.disconnect();
                        return;
                    }

                    var id = socket.request.session.passport.user.id;
                    var sessionId = socket.request.session.passport.user.sessionId;

                    socket.on('disconnect',() =>{
                        // NOTE, THIS DISCONNECTS on connection made from client ajax calls..
                        // So not reliable as session disconnect.
                        //console.log("user disconnected");
                        tracker.trackEvent(socket, event.makeEvent(sessionId, id, "disconnection", "Authorized", {} ) );
                    });

                    socket.on('event', function(data) {
                        //console.log(data);
                        //TODO: NOTE THIS MIGHT BE EMITTING TO LARGE CLIENT BASE
                        tracker.btrackEvent(socket, event.makeEvent(sessionId, id, data.eventType, data.name, data.data) );
                        //event.trackEvent( socket, event.makeEvent( id, data.eventType, data.name, data.data ) );
                    });

                    socket.on('trackEvent', function(data) {
                        console.log("SERVER GOT TRACK EVENT", data);
                    });

                    //console.log("emit event");
                    tracker.trackEvent( socket, event.makeEvent(sessionId, id, "connection", "Authorized", {} ) );
                });

// Add Developer Routes
require("./addRoutes.js")(app, socket_io);

// Error handling in common format (err,req,res,next)
var errorHandler = require('errorhandler');
if( app.get('env') === 'development' ){
    app.use( errorHandler() );
}