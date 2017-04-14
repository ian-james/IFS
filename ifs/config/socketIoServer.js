var _ = require('lodash');
var async = require('async');

module.exports = function (socket_io) {

    socket_io.on('connection', (socket) => {
        console.log("*********************** Connected");

        socket.on('disconnect',() =>{
            console.log("user disconnected");
        });

        socket.on('howdy', function(data) {
            console.log("Data:", data);
        });

        socket.on('disconnect',() =>{
            console.log("user disconnected");
        });

        socket.on('authorized',() =>{
            var id = socket.request.session.passport.user;
            console.log("YOUR ID IS ", id);
        });        

        socket.emit('greet', {my:'something'});
    });
}