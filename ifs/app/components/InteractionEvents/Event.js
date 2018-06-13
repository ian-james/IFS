var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

/* Retrieve or insert interactions events */

var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    /* Inserting Events */
    insertInteractionEvent: function( eventData ) {
        dbHelpers.insertEvent(dbcfg.users_interation_table,eventData);
    },

    /* Retrieval by types of events */
    getUserEvents: function( user, callback ){
        dbHelpers.selectWhere(dbcfg.users_interation_table, "userId", user, callback);
    },

    getEventType: function(eventType, callback) {
        dbHelpers.selectWhere(dbcfg.users_interation_table, "eventType", eventType, callback);
    },

    getByName: function(eventName, callback) {
        dbHelpers.selectWhere(dbcfg.users_interation_table, "name",eventName, callback);
    },

    /**
     *  Handles null and empty responses from data base.
     */

    returnData: function(data){
        if( _.isEmpty(data) || !_.has(data,'value'))
            return "Not available";
        return data.value;
    },
};
