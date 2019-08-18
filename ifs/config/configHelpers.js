var appDefaults = require( __configs + "appDefaults.json" );

let isProgramming = ( str ) => {
    return str && str.toLowerCase() == appDefaults.programming.toLowerCase();
}

let isWriting = ( str ) => {
    return str && str.toLowerCase() == appDefaults.writing.toLowerCase();
}

module.exports.isProgramming = isProgramming;
module.exports.isWriting = isWriting;