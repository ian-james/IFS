var _ = require('lodash');
var Logger = require( __configs + "loggingConfig");

module.exports = {

    cErr: function( msg ) {
        var e = new Error(msg);
        e.err = true;
        return e;
    },

    
}