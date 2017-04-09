function sendDataToServer(data){
    console.log("********************** SEND DATA TO THE SERVER FROM QUESTIONNAIRE");
    console.log("Here,", data);

    var result = {'title': data.title, result:data.data };

    // Check if we got results, otherwise return.
    if( Object.keys(data).length === 0 && data.constructor === Object )
        return;

    $.ajax( {
        url: "/survey/sentData",
        dataType: "json",
        type: "POST",
        data : JSON.stringify(result),
        contentType: "application/json; charset=UTF-8"
    });
}

