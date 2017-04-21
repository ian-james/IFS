
var iosocket = io.connect();

iosocket.on('trackEvent', function(data) {
    console.log("HERE RECEIVED", data);

    $("#eventsTable > tbody:last-child").append(
          '<tr>'
          + '<td> ' + data.eventType + "</td>"
          + '<td> ' + data.name + "</td>"
          + '<td> ' + data.time + "</td>"
          + '<td> ' + data.user+ "</td>" 
          + '<td> ' + JSON.stringify(data.data) + "</td>" 
          + '</tr>'
    );
});