$(document).ready(function(){
	var msg = $('#error').text();
	if (msg.length > 0) {
		UIkit.notification({message: msg, pos: 'top-center', status: 'danger'});
	}

    $('#test').empty();

    $.ajax({
        type: "get",
        url: '/tool/assignment',
        success: function (data, status) {
            var optsStr = "";
            for(var i = 0; i < data.result.length; i++)
            {
                optsStr += "<option value='" + data.result[i] + "'>" + data.result[i] + "</option>";
            }
            $('#test').append( optsStr );
        },
        error: function(req, err) {
            console.log(err);
        }
    })



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

