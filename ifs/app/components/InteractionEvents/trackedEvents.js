
var iosocket = io.connect();

iosocket.on('trackEvent', function(data) {
    $("#eventsTable > tbody:last-child").append(
          '<tr>'
          + '<td> ' + ( data.eventType ? data.eventType : data.action) + "</td>"
          + '<td> ' + data.name + "</td>"
          + '<td> ' + Date.now() + "</td>"
          + '<td> ' + data.userId + "</td>" 
          + '<td> ' + data.sessionId + "</td>" 
          + '<td> ' + JSON.stringify(data.data) + "</td>" 
          + '</tr>'
    );
});