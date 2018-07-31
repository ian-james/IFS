$(function() {
	$("#questionnaire").click(function(event)	{
		event.preventDefault();

		// Disable modal Alert
        var div = $("#modalAlert");
        div.toggleClass("uk-hidden",true);

        var button = $("#proceedBtn");
            button.toggleClass("uk-hidden", true);

        var title = $("#modalTitle");
        title.text("yay we got a modal!");


		// Make the processing modal visible
        var modal = UIkit.modal("#questionnaireModal");
        modal.show();
	})
})