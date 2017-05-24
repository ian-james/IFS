var socket = io();
$(function() {
    $("a").on('click', function(e) {
        console.log($(e.target) );
        // Check if link relates to nav-bar
        if($(e.target).hasClass('nav-link')) {
            socket.emit("event",{
                    "eventType": "view",
                    "name": "file",
                    "data": {'file': $(e.target)[0].innerText }
            });
        }
        else if($(e.target).hasClass("nocode")) {
            //TODO: Might want more information here to
            socket.emit("event",{
                    "eventType": "view",
                    "name": "feedback",
                    "data": {'feedback': $(e.target)[0].innerText }
            });
        }
        else if($(e.target).attr("href") == "#") {
            console.log("read more", $(e.target)[0]);
            socket.emit("event",{
                    "eventType": "view",
                    "name": "feedback",
                    "data":  "additionalInfo"
            });
        }
        else {
            console.log("else unknown clicker");
        }
    });
});
