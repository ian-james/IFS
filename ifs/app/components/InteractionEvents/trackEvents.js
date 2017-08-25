var dbHelpers = require(__components + "Databases/dbHelpers");
var submissionEvent = require(__components + "InteractionEvents/submissionEvents.js");
var eventDB = require(__components + "InteractionEvents/event.js" );
var dbcfg = require(__configs + 'databaseConfig');

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
    trackEvent: function (iosocket, event ) {
        eventDB.insertInteractionEvent(event);
        iosocket.emit("trackEvent", event);
    },

    /**
     * Track with broadcast, for client side
     * @param  {[type]} iosocket [description]
     * @param  {[type]} event    [description]
     * @return {[type]}          [description]
     */
    btrackEvent: function(iosocket, event ) {
        eventDB.insertInteractionEvent(event);
        iosocket.broadcast.emit('trackEvent', event);
    },

    /**
     * [btrackFeedbackEvent tracks feedback events and broadcasts it.]
     * @param  {[type]} iosocket [description]
     * @param  {[type]} eventDB  [description]
     * @param  {[type]} event    [description]
     * @return {[type]}          [description]
     */
    btrackFeedbackInteractionEvent: function(iosocket, event){
        dbHelpers.insertEvent(dbcfg.feedback_interaction_table,event);
        iosocket.broadcast.emit('trackEvent', event);
    }
};
