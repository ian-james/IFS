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
    var val = $(document.activeElement).text();

    console.log("hello!");

    $.ajax({
        type: "post",
        url:'/tool/preferences',
        dataType: 'json',
        data: {
        	tool: val
        },
        success: function (data, textStatus) {
        	if (data.redirect) {
        		window.location.href = data.redirect;
        		location.reload(true);
        	}
        },
        error: function (req, err){
            location.reload(true);
        }
    });
});