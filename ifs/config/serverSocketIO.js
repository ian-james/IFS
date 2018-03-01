var event = require(__components + "InteractionEvents/buildEvent.js" );
var tracker = require(__components + "InteractionEvents/trackEvents.js" );
var studentTask = require(__components + "StudentProfile/studentSkillDB.js");

module.exports = function (app, socket_io) {
    var clients = 0;
    socket_io.on('connection', (socket) => {
        //console.log("ON CONNECTION");
        //console.log( socket.handshake );
        if(!socket.request.user) {
            console.log("DISCONNECT no users", clients);
            socket.disconnect();
            return;
        }
        
        var id = socket.request.user.id;
        var sessionId = socket.request.user.sessionId;
        if( !id || !sessionId)
            return;

        clients++;
        console.log("Clients = ", clients);
//        console.log("My client info: ", id, " ", sessionId);

        socket.on('disconnect', () =>{
            // NOTE, THIS DISCONNECTS on connection made from client ajax calls..
            // So not reliable as session disconnect.
            clients--; 
            //tracker.trackEvent(socket, event.makeEvent(sessionId, id, "disconnection", "Authorized", {}));
        });

        socket.on('event', function(data) {
            //TODO: NOTE THIS MIGHT BE EMITTING TO LARGE CLIENT BASE
            console.log("EVENT SOCKET", data);
            tracker.btrackEvent(socket, event.makeEvent(sessionId, id, data.eventType, data.name, data.data) );
            //event.trackEvent( socket, event.makeEvent( id, data.eventType, data.name, data.data ) );
        });

        socket.on('feedbackEvent', function(data) {
            console.log("IFeedback  DATA EVENT", data);
            //TODO: NOTE THIS MIGHT BE EMITTING TO LARGE CLIENT BASE
            tracker.btrackFeedbackInteractionEvent(socket, event.makeFeedbackInteractionEvent(sessionId,id, data) );
        });

        socket.on('trackEvent', function(data) {
            console.log("SERVER GOT TRACK EVENT", data);
        });

        socket.on('studentAssignmentTaskEvent', function(data) {
            //console.log("STUDENT TASK", data);
            // Track the event in user interactions
            tracker.btrackEvent(socket, event.makeEvent(sessionId, id, data.eventType, data.name, data.data) );
            // Save
            studentTask.insertStudentAssignmentTask( data.studentId, data.assignmentTaskId , data.data, function(err,data){
                //TODO: nothing to do here if failures.
            });
        });

        socket.on('close', () => console.log("CLOSING SOCKET"));

        //tracker.trackEvent(socket, event.makeEvent(sessionId, id, "connection", "Authorized", {}));
    });
}
