$(document).ready(function(){
    //Display a previous error message, if it exists
	var msg = $('#error').text();
    if (msg.length > 0) {
        UIkit.notification({message: msg, pos: 'top-center', status: 'danger'});
    }

    var course = $('#course');
    var assign = $('#assign');
    var selectedCourse = "*";

    assign.empty();
    course.empty();

    $('#filePlaceholder').text("Please select files to upload for Assignment ??");
    $('#evaluate').text("Submit Files for Assignment ??");


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

                assign.toggleClass("uk-hidden", true);
                course.toggleClass("uk-hidden", false);
                $('#courseLab').toggleClass("uk-hidden", false);
                $('#assignLab').toggleClass("uk-hidden", true);
                
                var optsStr = "";

                optsStr += "<option value='None'>None</option>"
                for(var i = 0; i < res.result.length; i++)
                {
                    optsStr += "<option value='" + res.result[i] + "'>" + res.result[i] + "</option>";
                }
                course.append( optsStr );
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
    assign.empty();

    
    var courseSelected = course.find(":selected").text();

    $.ajax({
        type: "post",
        url: 'tool/assignment',
        data: {
            insert: courseSelected
        },
        success: function (res, status) {
            var optsStr = "";


            optsStr += "<option value='None'>None</option>"
            
            for(var i = 0; i < res.result.length; i++)
            {
                optsStr += "<option value='" + res.result[i] + "'>" + res.result[i] + "</option>";
            }

            assign.append( optsStr );

            if(courseSelected == "None")
            {
                assign.toggleClass("uk-hidden", true);
                $('#assignLab').toggleClass("uk-hidden", true);

                $('#filePlaceholder').text("Please select files to upload for Assignment ??");
                $('#evaluate').text("Submit Files for Assignment ??");
            }
            else
            {
                assign.toggleClass("uk-hidden", false);
                $('#assignLab').toggleClass("uk-hidden", false);

                // $('#evaluate').text("Submit Files for " + course.find(":selected").text() + " " + assign.find(":selected").text());
                // $('#filePlaceholder').text("Please select files to upload for " + course.find(":selected").text() + " " + assign.find(":selected").text())
            }

        }
    })

});

$("#assign").change(function() {
    var assign = $('#assign');
    var course = $('#course');

    if(assign.find(":selected").text() == "None")
    {
         $('#evaluate').text("Submit Files for " + course.find(":selected").text() + " Assignment ??");
         $('#filePlaceholder').text("Please select files to upload for " + course.find(":selected").text() + " Assignment ??");
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