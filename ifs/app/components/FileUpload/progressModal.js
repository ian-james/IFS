// Uploads the form data in an ajax request.
$(function() {
    $("#uploadForm").submit( function(event ) {
        
        // Prevent submission from happening.
        event.preventDefault();

        // Disable modal Alert
        var div = $("#modalAlert");
        div.toggleClass("uk-hidden",true);

        var button = $("#proceedBtn");
            button.toggleClass("uk-hidden", true);

        var title = $("#modalTitle");
        title.text("Uploading Files please wait...");

        // Make the processing modal visible
        var modal = UIkit.modal("#processingModal");
        modal.show();


        var uploadProgressBar = $('#progressbar')[0];
        
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
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                xhr.onprogress = function (e) {
                    if(e.lengthComputable) {
                    }
                };
                xhr.upload.onloadstart = function(e) {
                    uploadProgressBar.removeAttribute('hidden');
                    uploadProgressBar.max =  e.total;
                    uploadProgressBar.value =  e.loaded;
                };
                xhr.upload.onprogress = function(e) {
                    if(e.lengthComputable) {
                        uploadProgressBar.max =  e.total;
                        uploadProgressBar.value =  e.loaded;
                    }
                };
                xhr.upload.onload = function(e) {
                    uploadProgressBar.max =  e.total;
                    uploadProgressBar.value =  e.loaded;
                };
                return xhr;
            }
        }).done( function(data) {
            button.toggleClass("uk-hidden");
            
            title.text("Files successfully assessed");
        }).fail(function(xhr,error) {
            div.toggleClass("uk-hidden",false);
            div.first().text(JSON.parse(xhr.responseText).msg);
            
            title.text("Files failed to upload");
        }).always( function() {

            document.getElementById("submissionInput").value = "";

            setTimeout(function () {
                uploadProgressBar.setAttribute('hidden', 'hidden');
            }, 1000);
        });
    });

    // Make the proceed button visible.
    $("#proceedBtn").click( function(event) {
        window.location.replace("/feedback");
    });

    $("#submissionInput").change( function() {
        // Counts the num of tools checked to be used.
        var enabledCheckboxes = $('[id^="enabled-"]:checked').length;

      
        if(enabledCheckboxes)
            $("#uploadForm").submit();
        else {
            // Don't submit and setup an error message
              //TODO JF: Leaving this for now, it needs an alert message to indicate no files selected.
              // If this did run, it woould be caught by the server and a flash is presented but
              // an alert could happen here too before even submitting. Not sure how UIKit would do that.        

            var errMessage = $(".errorMessage");
            errMessage.text("Please select at least one tool");
            errMessage.parent().show();

            document.getElementById("submissionInput").value = "";
        }
    });
});