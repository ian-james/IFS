var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

module.exports = {
    makeEvent: function( userId, et, name, data, time = Date.now() ) {
        return { 
            "user": userId,
            "eventType": et,
            "name": name,
            "data": JSON.stringify(data),
            "time": time
        };
    },

    trackEvent(iosocket, event ) {
        //console.log("SEDNING EVENT", event );
        this.insertEvent(event);
        iosocket.emit("trackEvent", event);
    },

    btrackEvent(iosocket, event ) {
        //console.log("SEDNING BROADCAST EVENT", event );
        this.insertEvent(event);
        iosocket.broadcast.emit('trackEvent', event);
    },

    submissionEvent: function( userId, name, data ){
        return this.makeEvent( userId, "submission", name,  data );
    },

    surveyEvent: function (userId, name, data ){
        return this.makeEvent( userId, "survey", name,  data );
    },

    viewEvent:  function (userId, name, data ){
        return this.makeEvent( userId, "view", name,  data );
    },

    insertEventC: function(eventData, callback) {
        var query = "INSERT INTO " + config.users_interation_table + " (userId, eventType, name, data) values (?,?,?,?)";
        db.query(query, _.values(eventData), callback);
    },

    /**
     * Insert event callback logs errors but doesn't act on them.
     * @param  eventData created with makeEvent
     * @return No return
     */
    insertEvent: function( eventData ) {
        this.insertEventC(eventData, function(err,data){
            if(err)
                Logger.error(err);
        });
    }
};
