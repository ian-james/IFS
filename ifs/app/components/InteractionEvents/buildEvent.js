var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");
var eventDB = require(__components + "InteractionEvents/event.js" );

var _ = require('lodash');

module.exports = {

    // Note: sessionId is unique only to userId
    makeEvent: function(sessionId, userId, et, name, data ) {
        return {
            "userId": userId,
            "sessionId": sessionId,
            "eventType": et,
            "name": name,
            "data": JSON.stringify(data)
        };
    },

    trackEvent(iosocket, event ) {
        //console.log("SEDNING EVENT", event );
        eventDB.insertEvent(event);
        iosocket.emit("trackEvent", event);
    },

    btrackEvent(iosocket, event ) {
        //console.log("SEDNING BROADCAST EVENT", event );
        eventDB.insertEvent(event);
        iosocket.broadcast.emit('trackEvent', event);
    },

    submissionEvent: function( sessionId, userId, name, data ){
        return this.makeEvent( sessionId, userId, "submission", name,  data );
    },

    surveyEvent: function (sessionId,userId, name, data ){
        return this.makeEvent(sessionId, userId, "survey", name,  data );
    },

    viewEvent:  function (sessionId, userId, name, data ){
        return this.makeEvent(sessionId, userId, "view", name,  data );
    }
};
