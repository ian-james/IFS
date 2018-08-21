$(document).ready(function(){
    //Display a previous error message, if it exists
	var msg = $('#error').text();
    if (msg.length > 0) {
        UIkit.notification({message: msg, pos: 'top-center', status: 'danger'});
    }

    var course = $('#course');
    var assign = $('#assign');

    $.ajax({
        type: "get",
        url: '/tool/course',
        success: function (res, status) {
            if(res.result.length == 0)
            {
                assign.toggleClass("uk-hidden", true);
                course.toggleClass("uk-hidden", true);
                $('#courseLab').toggleClass("uk-hidden", true);
                $('#assignLab').toggleClass("uk-hidden", true);
                
            }
            else
            {
                course.toggleClass("uk-hidden", false);
                assign.toggleClass("uk-hidden", true);
                $('#courseLab').toggleClass("uk-hidden", false);
                $('#assignLab').toggleClass("uk-hidden", true);

                for (var c of res.result) {
                    var option = document.createElement("option");
                    option.text = c;
                    course.append(option);
                }
            }
            
        },
        error: function(req, err) {
            console.log(err);
        }
    })
});

$("#course").change(function() {
    var assign = $('#assign');
    var course = $('#course');
    
    var courseSelected = course.find(":selected").text();

    $.ajax({
        type: "post",
        url: 'tool/assignment',
        data: {
            insert: courseSelected
        },
        success: function (res, status) {
            //Remove each option in the list if it is not "None"
            $('#assign option').each(function() {
                if ($(this).val() != 'None') {
                    $(this).remove();
                }
            });

            //Add all new options to the list
            for (var a of res.result) {
                var option = document.createElement("option");
                option.text = a;
                assign.append(option);
            }

            if(courseSelected == "None")
            {
                assign.toggleClass("uk-hidden", true);
                $('#assignLab').toggleClass("uk-hidden", true);

                $('#filePlaceholder').text("Please select files to upload");
                $('#evaluate').text("Submit Files");
            }
            else
            {
                assign.toggleClass("uk-hidden", false);
                $('#assignLab').toggleClass("uk-hidden", false);

                $('#evaluate').text("Submit Files for " + course.find(":selected").text());
                $('#filePlaceholder').text("Please select files to upload for " + course.find(":selected").text());
            }

        }
    })

});

$("#assign").change(function() {
    var assign = $('#assign');
    var course = $('#course');

    if(assign.find(":selected").text() == "None")
    {
         $('#evaluate').text("Submit Files for " + course.find(":selected").text());
         $('#filePlaceholder').text("Please select files to upload for " + course.find(":selected").text());
    }
    else
    {
        $('#evaluate').text("Submit Files for " + course.find(":selected").text() + " " + assign.find(":selected").text());
        $('#filePlaceholder').text("Please select files to upload for " + course.find(":selected").text() + " " + assign.find(":selected").text())

    }        
});

$("#settingsToggle").click(function() {
    $("#settingsToggle").toggleClass("uk-button-primary");
});

$('#error').bind("DOMSubtreeModified",function(){
	var msg = $('#error').text();
	if (msg.length > 0) {
		UIkit.notification({message: msg, pos: 'top-center', status: 'danger'});
	}
});