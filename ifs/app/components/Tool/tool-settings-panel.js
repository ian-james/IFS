$(document).ready(function(){
	var msg = $('#error').text();
	if (msg.length > 0) {
		UIkit.notification({message: msg, pos: 'top-center', status: 'danger'});
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

$("#toolPreference").submit(function(event) {
    console.log(event);
    var val = $(document.activeElement).text();

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