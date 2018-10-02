$(document).ready(function() {
	var msg = $('#error').text();
    var course = $('#course');
    var assign = $('#assign');
    var selectedCourse = "*";
	if (msg.length > 0) {
		UIkit.notification({message: msg, pos: 'top-center', status: 'danger'});
	}

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
                optsStr += "<option value='None'" + ((res.selectedId == -1 )? " selected " : "" ) + ">None</option>"
                for(var i = 0; i < res.result.length; i++)
                {
                    console.log("onece", res.selectedId, " ", i );
                    console.log( res.selectedId == 0 );
                    optsStr += "<option value='" + res.result[i] + "'" + ((res.selectedId == i )? " selected " : "" ) + " >" + res.result[i] + "</option>";
                }
                course.append( optsStr );

                if( res.selectedId >= 0)
                    $('#course').trigger('change');
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
            optsStr += "<option value='None'" + ((res.selectedId == -1 ) ? " selected " : "") + ">None</option>"

            for(var i = 0; i < res.result.length; i++)
            {
                optsStr += "<option value='" + res.result[i] + "'" + ((res.selectedId == i) ? " selected " : "") + " >" + res.result[i] + "</option>";
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
            }

            if( res.selectedId >= 0)
                $('#assign').trigger('change');
        }
    })

});

$("#assign").change(function() {
    var assign = $('#assign');
    var course = $('#course');

    var courseSelected = course.find(":selected")
    var courseSelectedText = courseSelected.text();

    var assignSelected = assign.find(":selected");
    var assignSelectedText = assign.find(":selected").text();


    if(assign.find(":selected").text() == "None")
    {
         $('#evaluate').text("Submit Files for " + courseSelectedText + " Assignment ??");
         $('#filePlaceholder').text("Please select files to upload for " + courseSelectedText + " Assignment ??");
    }
    else
    {
        $('#evaluate').text("Submit Files for " + courseSelectedText + " " + assign.find(":selected").text());
        $('#filePlaceholder').text("Please select files to upload for " + courseSelectedText + " " + assignSelectedText)
    }

    // AJAX request to save the student's selection
    $.ajax({
        type: "post",
        url: 'tool/saveSubmissionFocusData',
        data: {
            courseName: courseSelectedText,
            assignName: assignSelectedText
        },
        success: function (res, status) {
        },
        error: function(req,err) {
            console.log("FAILED: To send student submission focus.");
        }
    });
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