var _ = require('lodash');
var Logger = require( __configs + "loggingConfig");

module.exports = {

    /**
     * Create a simple error object with key err and message
     * @param  {[type]} msg [description]
     * @return {[type]}     [description]
     */
    cErr: function( msg ) {
        var e = new Error(msg);
        e.err = true;
        return e;
    },

    /**
     * Check if obj has the specific error key 
     * @param  {Object}  obj 
     * @return {Boolean}    Whether err key was found in object
     */
    hasErr: function( obj ) {
        return  obj && _.has(obj,'err');
    },

    /**
     * [hasErrLog description]
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    ifErrLog: function( obj ) {
        var r =  this.hasErr(obj);
        if( r )
            this.logErr(obj);
        return r;
    },

    /**
     * Retrieve the error message from an error object
     * @param  {ErrorObj]} obj 
     * @return {[String]} return the message or empty string.
     */
    getErrMsg: function( obj ) {
        return this.hasErr(obj) ? obj.message : "";
    },

    /**
     * Creates an error with message and Logs it with error priority.
     * @param  {string]} msg 
     * @return {[Obj}  error object based on cErr
     */
    cLogErr: function( msg ) {
        Logger.error(msg);
        return this.cErr(msg);
    },

    /**
     * Logs an error if the message exists
     * @param  {[Object]} obj An error Object
     * @return  void
     */
    logErr: function( obj ) {

        var msg = this.getErrMsg( obj );
        if( msg && msg.length != 0 )
            Logger.error(msg);
    },

    /**
     * Console log multiple items easily.
     * @return displayed items to console.
     */
    cl: function() {
        for(var i =0;i< arguments.length; i++) {
            console.log("Var i ", arguments[i] );
        }
    },

    /**
     * Highlighted Console log for debugging multiple items
     * @return displayed console
     */
    hcl: function() {
        console.log("*************************************** ", arguments[0]);
         for(var i =0;i< arguments.length; i++) {
            console.log("Var i ", arguments[i] );
        }
        console.log("************** END ******************** ", arguments[0]);
    }
}