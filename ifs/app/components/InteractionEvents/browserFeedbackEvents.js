var socket = io(); 
$(function() {
    $("a").on('click', function(e) {
        // Check if link relates to nav-bar, ie changing viewing file.
        if($(e.target).hasClass('nav-link') ) {

            socket.emit("event",{
                    "eventType": "view",
                    "name": "file",
                    "data": {'file': $(e.target)[0].innerText }
            });
        }
        else if( $(e.target).hasClass("nocode") ){
           // Clicking a link for feedback minicard.
            socket.emit("feedbackEvent",{
                    "feedbackId": parseInt($(e.target).attr('data-feedbackid')),
                    "submissionId": parseInt($(e.target).attr('data-submissionId')),
                    "action": "viewed"
            });
        }
        else if( $(e.target).attr("href") == "#") {
            // NOTE: HANDLED IN popoverFeedbackEvents.js
            // Here in case it falls into this case.
            socket.emit("feedbackEvent",{
                    "feedbackId": $(e.target).attr('data-feedbackid'),
                    "submissionId":  $(e.target).attr('data-submissionId'),
                    "action": "viewedMore"
            });
        }
        else {
        }
    });
});