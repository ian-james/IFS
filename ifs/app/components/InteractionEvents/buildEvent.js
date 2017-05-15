var Logger = require( __configs + "loggingConfig");
var eventDB = require(__components + "InteractionEvents/event.js" );

/* build basic objects for event Event Types */

var _ = require('lodash');

module.exports = {

    eventID: function(req){
        return {
            "userId": req.user.id,
            "sessionId": req.user.sessionId
        };
    },

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

    makeFeedbackEvent: function( sessionId, userId, submissionId, toolFeedbackItem ){

        var e = {};
        try {
            var keys = [
                'toolName',
                'filename',
                'runType',
                'type',
                'charPos',
                'charNum',
                'lineNum',
                'target',
                'suggestion',
                'feedback',
                'severity'
            ];

            e =  _.pick(toolFeedbackItem,keys);
            e['userId'] = userId;
            e['sessionId'] = sessionId;
            e['submissionId'] = submissionId;
        }
        catch( e ){
            Logger.error("Error Making feedback");
        }

        return e;
    },

    submissionEvent: function( sessionId, userId, name, data ){
        return this.makeEvent( sessionId, userId, "submission", name,  data );
    },

    surveyEvent: function (sessionId,userId, name, data ){
        return this.makeEvent(sessionId, userId, "survey", name,  data );
    },

    viewEvent:  function (sessionId, userId, name, data ){
        return this.makeEvent(sessionId, userId, "view", name,  data );
    },
};
