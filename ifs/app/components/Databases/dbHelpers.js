var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

module.exports = {
    buildWS: function(key) {
        return "WHERE " + key + " = ?";
    },

    /**
     * Build where statement with multiple keys
     * @param  {[type]} keys [description]
     * @return {[type]}      [description]
     */
    buildWhere: function(keys){
        if(!keys || keys.length == 0)
            return "";
        if(keys.length == 1 )
            return this.buildWS(keys[0]);

        return  "WHERE " +  _.join(keys, " = ? AND  ") + " = ?";
    },

    buildValues: function(keys){
        if( _.isPlainObject(keys))
            keys = _.keys(keys);

        // build values part of sql statement ex) (var1, var2, var3) values (?,?,?);
        var res = "(" +  _.join(keys,',') + ") VALUES (" + _.repeat("?,", keys.length-1) + "?)";
        return res;
    },

    buildInsert: function(table) {
        return "INSERT INTO " + table + " ";
    },

    buildInsertIgnore: function(table) {
        return "INSERT IGNORE INTO " + table + " ";
    },

    buildSelect: function(table, sel = "*") {
        return "SELECT " + sel + " FROM " + table + " ";
    },

    buildDelete: function(table) {
         return " DELETE FROM " + table + " ";
    },

    buildUpdate: function(table) {
        return " UPDATE " + table + " ";
    },

    insert: function(table, data){
        return this.buildInsert(table) + this.buildValues(data);
    },

    select: function(table, data){
        return this.buildSelect(table) + this.buildValues(data);
    },

    update: function(table, data){
        return this.buildUpdate(table) + this.buildValues(data);
    },

    delete: function(table, data) {
        return this.buildDelete(table) + this.buildValues(data);
    },

    // Event Specific starts here

    selectWhere: function(table, name, data, callback) {
        var q = this.buildSelect(table) +  this.buildWS(name);
        db.query(q,data,callback);
    },

    insertEventC: function (table, eventData, callback) {
        var q = this.insert(table, eventData)
        db.query(q, _.values(eventData), callback);
    },

    /**
     * Insert event callback logs errors but doesn't act on them.
     * @param  eventData created with makeEvent
     * @return No return
     */
    insertEvent: function(table, eventData) {
        this.insertEventC(table, eventData, function(err,data) {
            if(err)
                Logger.error(err);
        });
    }
};
