var Logger = require( __configs + "loggingConfig");
var eventDB = require(__components + "InteractionEvents/event.js" );

/**
 * These are helper functions to build events, some events will only arrive from "objects"
 * So then we're simplying 'picking' the keys we need from the object.
 */

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


    /**
     * Feedback items are stored using this format in DB.
     * @param  {[type]} sessionId        [description]
     * @param  {[type]} userId           [description]
     * @param  {[type]} submissionId     [description]
     * @param  {[type]} toolFeedbackItem [description]
     * @return {[type]}                  [description]
     */
    makeFeedbackEvent: function( sessionId, userId, submissionId, toolFeedbackItem ){
        var e = {};
        try {
            e['userId'] = userId;
            e['sessionId'] = sessionId;
            e['submissionId'] = submissionId;

            var requiredKeys = [
                'toolName',
                'runType',
                'filename',
                'type'
            ];

            var rk =  _.pick(toolFeedbackItem,requiredKeys);

            var keys = [
                'route',
                'charPos',
                'charNum',
                'lineNum',
                'target',
                'suggestions',
                'feedback',
                'severity',
                'hlBeginChar',
                'hlEndChar',
                'hlBeginLine',
                'hlEndLine',
            ];

            // Pick non-empty and non required keys from feedback object.
            var k = _.pickBy(toolFeedbackItem, function(value,key){
                return (value !== "" && keys.indexOf(key) >= 0 );
            });
            e = _.assign(e, rk, k);

            e['suggestions'] = JSON.stringify(e['suggestions']);
        } catch(e) {
            Logger.error("Error Making feedback");
        }

        return e;
    },

    /**
     * Make feedback interaction events from object for DB.
     * @param  {[type]} eventData [description]
     * @return {[type]}           [description]
     */
    makeFeedbackInteractionEvent: function( sessionId, userId, eventData ) {
        var e = {};
        try {
            e['userId'] = userId;
            e['sessionId'] = sessionId;

            var requiredKeys = [
                'submissionId',
                'feedbackId',
                'action'
            ];

            var rk =  _.pick(eventData,requiredKeys);
            e = _.assign(e, rk);
        } catch(e) {
            Logger.error("Error Making feedback interaction event");
        }
        return e;
    },

    makeFeedbackStatsEvent: function( sessionId, userId, submissionId, toolFeedbackItem){
        var e = {};
        try {
            e['userId'] = userId;
            e['sessionId'] = sessionId;
            e['submissionId'] = submissionId;

            var requiredKeys = [
                'filename',
                'toolName',
                'name',
                'type',
                'level',
                'category',
                'statName',
                'statValue'
            ];

            var rk =  _.pick(toolFeedbackItem,requiredKeys);
            e = _.assign(e, rk);
        } catch(e) {
            Logger.error("Error Making feedback interaction event");
        }
        return e;
    },

    submissionEvent: function(sessionId, userId, name, data){
        return this.makeEvent(sessionId, userId, "submission", name,  data);
    },

    surveyEvent: function (sessionId,userId, name, data){
        return this.makeEvent(sessionId, userId, "survey", name,  data);
    },

    viewEvent:  function (sessionId, userId, name, data){
        return this.makeEvent(sessionId, userId, "view", name,  data);
    },

    changeEvent: function( sessionId, userId, name, data) {
        return this.makeEvent( sessionId, userId, "change", name, data);
    }
};
