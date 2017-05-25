/* This code is from browserFeedbackEvents but because it's injected later on.
   I believe it needs to be loaded when the minicard is loaded.
   Previous version created an event handler each click..trying to fix that.
*/
var socket = io(); 
$(function() {
    $("a.readMoreEvent").on('click', function(e) {
        if( $(e.target).attr("href") == "#") {
            // Read More has been clicked
            console.log("read more", $(e.target)[0]);
            socket.emit("feedbackEvent",{
                    "feedbackId": $(e.target).attr('data-feedbackid'),
                    "submissionId":  $(e.target).attr('data-submissionId'),
                    "action": "viewedMore"
            });
        }
    });
});