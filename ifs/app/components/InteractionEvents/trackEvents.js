var dbHelpers = require(__components + "Databases/dbHelpers");
var submissionEvent = require(__components + "InteractionEvents/submissionEvents.js");
var eventDB = require(__components + "InteractionEvents/event.js" );

var _ = require('lodash');

module.exports = {

    /**
     * Track submissions events to submission DB.
     * @param  {[type]} iosocket  [description]
     * @param  {[type]} userId    [description]
     * @param  {[type]} sessionId [description]
     * @return {[type]}           [description]
     */
    trackSubmission: function( iosocket, userId, sessionId ){

       submissionEvent.addSubmission( {"userId": userId, "sessionId": sessionId } );
        //iosocket.emit("trackEvent", event);
    },

    /**
     * Track interactions events.
     * @param  {[type]} iosocket [description]
     * @param  {[type]} event    [description]
     * @return {[type]}          [description]
     */
    trackEvent(iosocket, event ) {
        //console.log("SEDNING EVENT", event );
        eventDB.insertInteractionEvent(event);
        iosocket.emit("trackEvent", event);
    },  
    

    /**
     * Tack with broadcast, for client side
     * @param  {[type]} iosocket [description]
     * @param  {[type]} event    [description]
     * @return {[type]}          [description]
     */
    btrackEvent(iosocket, event ) {
        //console.log("SEDNING BROADCAST EVENT", event );
        eventDB.insertInteractionEvent(event);
        iosocket.broadcast.emit('trackEvent', event);
    },
};
