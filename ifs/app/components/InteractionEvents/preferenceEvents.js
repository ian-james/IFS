var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {
     /************************ Preference Event *******************************************/
    getPreferenceChanges: function( userId ){
        return {
            'name': "preferenceChanges",
            'data':[userId],
            'request': "select userId, prefId as value  from preferences where userId = ? ORDER BY userId desc LIMIT 1"
        };
    },
};