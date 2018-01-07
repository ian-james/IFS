/*

 module.exports = {
    makeEvent: function( userId, et, name, data, time = Date.now() ) {
        return {
            "eventType": et,
            "name": name,
            "time": time,
            "user": userId,
            "data": data
        };
    },

    trackEvent(iosocket, event ) {
        console.log("SENDING EVENT", event );
        iosocket.emit("trackEvent", event);
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

    changeEvent: function( userId, name, data) {
        return this.makeEvent( userId, "change", name,data);
    }
};
*/
