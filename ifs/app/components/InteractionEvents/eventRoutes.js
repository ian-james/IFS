var event = require(__components + "InteractionEvents/buildEvent.js" );
var tracker = require(__components + "InteractionEvents/trackEvents.js" );

module.exports = function (app, iosocket) { 

    /* This function will pre-catch all calls to the server 
       and keep track of basic usage stats.
    */

    app.use(function(req,res, next) {

        if( req.user)
        {
            tracker.trackEvent( iosocket, event.viewEvent(req.user.sessionId, req.user.id, "page", req.originalUrl));
        }

        next();
    });

}