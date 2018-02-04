var event = require(__components + "InteractionEvents/buildEvent.js" );
var tracker = require(__components + "InteractionEvents/trackEvents.js" );
var studentTask = require(__components + "StudentProfile/studentSkillDB.js");

module.exports = function (app, socket_io) {
    socket_io.on('connection', (socket) => {
        if(! socket.request.user) {
            socket.disconnect();
            return;
        }
        
        var id = socket.request.user.id;
        var sessionId = socket.request.user.sessionId;

        socket.on('disconnect', () =>{
            // NOTE, THIS DISCONNECTS on connection made from client ajax calls..
            // So not reliable as session disconnect.
            tracker.trackEvent(socket, event.makeEvent(sessionId, id, "disconnection", "Authorized", {}));
        });

        socket.on('event', function(data) {
            //TODO: NOTE THIS MIGHT BE EMITTING TO LARGE CLIENT BASE
            tracker.btrackEvent(socket, event.makeEvent(sessionId, id, data.eventType, data.name, data.data) );
            //event.trackEvent( socket, event.makeEvent( id, data.eventType, data.name, data.data ) );
        });

        socket.on('feedbackEvent', function(data) {
            //console.log("IFeedback  DATA EVENT", data);
            //TODO: NOTE THIS MIGHT BE EMITTING TO LARGE CLIENT BASE
            tracker.btrackFeedbackInteractionEvent(socket, event.makeFeedbackInteractionEvent(sessionId,id, data) );
        });

        socket.on('trackEvent', function(data) {
            //console.log("SERVER GOT TRACK EVENT", data);
        });

        socket.on('studentAssignmentTaskEvent', function(data) {
            // Track the event in user interactions
            tracker.btrackEvent(socket, event.makeEvent(sessionId, id, data.eventType, data.name, data.data) );
            // Save
            studentTask.insertStudentAssignmentTask( data.studentId, data.assignmentTaskId , data.data, function(err,data){
                //TODO: nothing to do here if failures.
            });
        });

        tracker.trackEvent(socket, event.makeEvent(sessionId, id, "connection", "Authorized", {}));
    });
}