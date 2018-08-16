$(document).ready(function(){
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

                assign.toggleClass("uk-hidden", false);
                course.toggleClass("uk-hidden", false);
                $('#courseLab').toggleClass("uk-hidden", false);
                $('#assignLab').toggleClass("uk-hidden", false);
                
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

    $.ajax({
        type: "post",
        url: '/tool/assignment',
        data: {
            insert: selectedCourse
        },
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
                assign.toggleClass("uk-hidden", false);
                course.toggleClass("uk-hidden", false);
                $('#courseLab').toggleClass("uk-hidden", false);
                $('#assignLab').toggleClass("uk-hidden", false);

                var optsStr = "";
                optsStr += "<option value='None'>None</option>"            

                for(var i = 0; i < res.result.length; i++)
                {
                    optsStr += "<option value='" + res.result[i] + "'>" + res.result[i] + "</option>";
                }

                assign.append( optsStr );
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

            if(course == "None")
            {
                optsStr += "<option value='None'>None</option>"
            }
            for(var i = 0; i < res.result.length; i++)
            {
                optsStr += "<option value='" + res.result[i] + "'>" + res.result[i] + "</option>";
            }

            assign.append( optsStr );

            if(courseSelected == "None")
            {
                $('#filePlaceholder').text("Please select files to upload for Assignment ??");
                $('#evaluate').text("Submit Files for Assignment ??");
            }
            else
            {
                $('#evaluate').text("Submit Files for " + course.find(":selected").text() + " " + assign.find(":selected").text());
                $('#filePlaceholder').text("Please select files to upload for " + course.find(":selected").text() + " " + assign.find(":selected").text())
            }

        }
    })

})

$("#settingsToggle").click(function() {
    $("#settingsToggle").toggleClass("uk-button-primary");
});

$('#error').bind("DOMSubtreeModified",function(){
	var msg = $('#error').text();
	if (msg.length > 0) {
		UIkit.notification({message: msg, pos: 'top-center', status: 'danger'});
	}
});

$("#toolPreference").submit(function(event) {
    var val = event.originalEvent.explicitOriginalTarget.innerHTML;

    $.ajax({
        type: "post",
        url:'/tool/preferences',
        dataType: 'json',
        data: {
        	tool: val
        },
        success: function (data, textStatus) {
        	location.reload(true);
        },
        error: function (req, err){
            location.reload(true);
        }
    });
});

