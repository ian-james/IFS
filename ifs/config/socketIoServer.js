var _ = require('lodash');
var async = require('async');

module.exports = function (socket_io) {

    socket_io.on('connection', (socket) => {
        console.log("SOCKETIO>>>>>>>>>>>>>>>>>>");
        
        socket.on('disconnect',() =>{
            console.log("user disconnected");
        });

        socket.on('howdy', function(data) {
            console.log("Data:", data);
        });

        socket.emit('greet', {my:'something'});
    });
}