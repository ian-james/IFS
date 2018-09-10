// Uploads the form data in an ajax request.
$(function() {
    $("#uploadForm").submit(function(event) {
        // Prevent submission from happening.
        // Exit function, because a button takes care of this
        event.preventDefault();
        return false;
    });

    $("#evaluate").click(function(event) {
        // Prevent submission from happening.
        event.preventDefault();

        //If there are no files uploaded, show an error message and exit
        let files = document.getElementById('submissionInput').files;

        if (files.length == 0) {
            var errMessage = $(".errorMessage");
            errMessage.text("Please upload at least one file");
            errMessage.parent().show();
            return false;
        }

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

            return false;
            //$("#submissionInput").value = "";
        }

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


        var assign = $('#assign');
        var code = assign.find(":selected").text();
        var assignId = 0;

        var form = new FormData($('#uploadForm')[0]);

        $.ajax({
            type: "post",
            url: '/assignment',
            async: false,
            data: {
                course: code
            },
            success: function(res, status) {
                assignId = res.assignment;
            }
        });

        form.append('assignId', assignId);

        // Create an AJAX request with all the upload form data
        // available. Upon completion feedback button is available
        // to progress or alert with error message.
        var date = new Date();
        date = Math.floor(date / 100);
        $.ajax({
            type: "POST",
            url:'/tool_upload',
            multiple: true,
            data: form,
            headers: {
                'token': date
            },
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
            if( data.err ){
                // HACK: Only necessary because fileUploadRoutes.js isn't sending HTTP codes.
                // So we're separating a couple errors here instead.
                title.text("Assessment failed, unabled to process files.");
            }
            else {
                button.toggleClass("uk-hidden");
                title.text("Files successfully assessed");
            }

        }).fail(function(xhr,error) {
            div.toggleClass("uk-hidden",false);
            div.first().text(JSON.parse(xhr.responseText).msg);

            title.text("Files failed to upload");
        }).always( function() {
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
        let files = document.getElementById('submissionInput').files;
        let filePlaceholder = document.getElementById("filePlaceholder");
        let fileList = document.getElementById("fileList");

        filePlaceholder.style.display = "none";
        fileList.style.display = "inline";

        $(fileList).empty();

        let title = document.createElement("li");
        title.innerHTML = "<strong>\
                            The following files will be uploaded and evaluated:\
                            </strong>";
        fileList.appendChild(title);

        for (var i = 0; i < files.length; i++) {
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(files[i].name));
            fileList.appendChild(li);
        }
    });
});
