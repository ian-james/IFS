/* This code is from browserFeedbackEvents but because it's injected later on.
   I believe it needs to be loaded when the minicard is loaded.
   Previous version created an event handler each click..trying to fix that.
*/
var socket = io();
$(function() {
    $("a.rateDown").on('click', function(e) {
        if( $(e.target).attr("href") == "#") {
            socket.emit("feedbackEvent",{
                "feedbackId": $(e.target).attr('data-feedbackid'),
                "submissionId":  $(e.target).attr('data-submissionId'),
                "action": "rateDown"
            });
        }
    });

    $("a.rateUp").on('click', function(e) {
        if( $(e.target).attr("href") == "#") {
            socket.emit("feedbackEvent",{
                "feedbackId": $(e.target).attr('data-feedbackid'),
                "submissionId":  $(e.target).attr('data-submissionId'),
                "action": "rateUp"
            });
        }
    });
});