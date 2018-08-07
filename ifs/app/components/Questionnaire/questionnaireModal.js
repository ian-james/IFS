$(function() {

	var i = 0

	// list of question texts for the modal
	var list = ["What is the name of the assignment?", "When is the assignment due?", "How comfortable are you with this assignment?"];

	// list of modal tags to swap (associated with the list above)
	var modalList = ["#assignText", "#dueDate", "#comfort"];

	$("#questionnaire").click(function(event) {
		event.preventDefault();

		// Disable modal Alert
		var div = $("#modalAlert");
		div.toggleClass("uk-hidden",true);

		var title = $("#modalTitle");
		title.text("Task Decomposition Modal");

		var questionNum = $("#questionNum");
		questionNum.text("Question " + (i+1));

		var questionText = $("#questionText");
		questionText.text(list[i])

		toggleDisplay();

		var modal = UIkit.modal("#questionnaireModal");
        modal.show();
	});

	$("#Next").click(function(event) {
		saveBaseProgress();

		//Ensure we don't go out of bounds
		if (i+1 > list.length-1) return;

		i++;

		//Question text change
		$("#questionNum").text("Question " + (i+1));
		$("#questionText").text(list[i]);

		toggleDisplay();	
	});

	$("#Prev").click(function(event) {
		saveBaseProgress();
		
		//Ensure we don't go out of bounds
		if (i-1 < 0) return;

		i--;

		//Question text change
		$("#questionNum").text("Question " + (i+1));
		$("#questionText").text(list[i]);

		toggleDisplay();
	});

	function toggleDisplay() {
		for(var j = 0; j < list.length; j++) {
			if(j == i) {
				$(modalList[j]).toggleClass("uk-hidden", false);
			} else {
				$(modalList[j]).toggleClass("uk-hidden", true);
			}
		}
	}

	function saveBaseProgress() {
		//Get the field values and store in JSON object
		var nameAssignment = $("#assignText").val();
		var dueDate = $("#dueDate").val();
		var comfortLevel = $("input[name='radio']:checked").val();
		var insert = {'assignment': nameAssignment, 'dueDate': dueDate, 'comfortLevel': comfortLevel}

		//Insert into the database
		$.ajax({
			type: 'POST',
			url: '/taskDecompBaseStore',
			data: insert
			
		}).done(function(data) {
		})
	}
})