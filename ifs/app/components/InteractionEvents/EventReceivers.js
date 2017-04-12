var socket = io();

socket.on('greet', function(data) {
    console.log("Hi,", data);
    socket.emit("howdy",{msg: 'send you something'});
});