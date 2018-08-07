$(function() {

	var i = 0

	// list of question texts for the modal
	var list = ["What is the name of the assignment?", "When is the assignment due?", "How comfortable are you with this assignment?"];

	// list of modal tags to swap (associated with the list above)
	var modalList = ["#assignText", "#dueDate", "#comfort"];

	$("#questionnaire").click(function(event)	{
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

		// question modal part change
		for(var j = 0; j < list.length; j++)
		{
			if(j == i)
			{
				$(modalList[j]).toggleClass("uk-hidden", false);
			}
			else
			{
				$(modalList[j]).toggleClass("uk-hidden", true);
			}
		}

		var modal = UIkit.modal("#questionnaireModal");
        modal.show();

	})

	$("#Next").click(function(event) 	{

		// store fields into JSON object
		var nameAssignment = $("#assignText").val();
		var dueDate = $("#dueDate").val();
		var comfortLevel = $("input[name='radio']:checked").val();
		var insert = {'assignment': nameAssignment, 'dueDate': dueDate, 'comfortLevel': comfortLevel}

		//insert the data into the database
		$.ajax({
			type: 'POST',
			url: '/questionnaire',
			data: insert
			
		}).done(function(data) {
			
		})


		i++;
		if(i > list.length-1)
		{
			i = list.length-1;
		}

		//quesiton number change
		var questionNum = "Question " + (i+1);

		//question text change
		$("#questionNum").text(questionNum);
		$("#questionText").text(list[i]);


		//question modal part change
		for(var j = 0; j < list.length; j++)
		{
			if(j == i)
			{
				$(modalList[j]).toggleClass("uk-hidden", false);
			}
			else
			{
				$(modalList[j]).toggleClass("uk-hidden", true);
			}
		}


		
	})

	$("#Prev").click(function(event) 	{

		//get the field values and store in JSON object
		var nameAssignment = $("#assignText").val();
		var dueDate = $("#dueDate").val();
		var comfortLevel = $("input[name='radio']:checked").val();
		var insert = {'assignment': nameAssignment, 'dueDate': dueDate, 'comfortLevel': comfortLevel}

		//insert into the database
		$.ajax({
			type: 'POST',
			url: '/questionnaire',
			data: insert
			
		}).done(function(data) {
			
		})


		i--;
		if(i < 0)
		{
			i = 0;
		}

		//question number displayed		
		var questionNum = "Question " + (i+1);

		//changing the question text 
		$("#questionNum").text(questionNum);
		$("#questionText").text(list[i]);

		//changing which part of the modal is displayed
		for(var j = 0; j < list.length; j++)
		{
			if(j == i)
			{
				$(modalList[j]).toggleClass("uk-hidden", false);
			}
			else
			{
				$(modalList[j]).toggleClass("uk-hidden", true);
			}
		}

		
	})

})