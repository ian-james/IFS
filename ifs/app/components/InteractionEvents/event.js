var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {
   
    getUserEvents: function( user, callback ){
        dbHelpers.selectWhere(config.users_interation_table, "userId", user, callback);
    },

    getEventType: function(eventType, callback) {
        dbHelpers.selectWhere(config.users_interation_table, "eventType", eventType, callback);
    },

    getByName: function(eventName, callback) {
        dbHelpers.selectWhere(config.users_interation_table, "name",eventName, callback);
    },

    insertEvent: function( eventData ) {
        dbHelpers.insertEvent(config.users_interation_table,eventData);
    }
};
