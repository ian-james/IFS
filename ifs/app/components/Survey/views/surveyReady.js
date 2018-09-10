/**
 * Create an ajax request for sending survey data to server.
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function sendDataToServer(data) {
  var result = {
    'title': data.title,
    result: data.data,
    isPulse: data.valuesHash.isPulse
  };

  // Check if we got results, otherwise return.
  if (Object.keys(data).length === 0 && data.constructor === Object)
    return;

  $.ajax({
    url: "/survey/sentData",
    dataType: "json",
    type: "POST",
    data: JSON.stringify(result),
    contentType: "application/json; charset=UTF-8"
  });
}