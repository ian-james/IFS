// Uploads the form data in an ajax request.
$("#uploadForm").submit( function(event ) {

    // Prevent submission from happening.
    event.preventDefault();

    // Disable modal Alert
    var div = $("#modalAlert");
    div.toggleClass("uk-invisible",true);

    // Make the processing modal visible
    var modal = UIkit.modal("#processingModal");
    modal.show();
    
    // Create an AJAX request with all the upload form data
    // available. Upon completion feedback button is available 
    // to progress or alert with error message.
    $.ajax({ 
        type: "POST",
        url:'/tool_upload',
        multiple: true,
        data: new FormData($('#uploadForm')[0]),
        processData: false,
        contentType: false,
    }).done( function(data) {
        var button = $("#proceedBtn");
        button.toggleClass("uk-invisible");
    }).fail(function(xhr,error) {
        var div = $("#modalAlert");
        div.toggleClass("uk-invisible",false);
        div.first().text(JSON.parse(xhr.responseText).msg);
    });
});

// Make the proceed button visible.
$("#proceedBtn").click( function(event) {
    window.location.replace("/feedback");
});
