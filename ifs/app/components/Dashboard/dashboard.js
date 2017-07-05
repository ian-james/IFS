 function onCheckboxClick() {
    if($("input[type='checkbox']:checked").length == $("input[type='checkbox']").length ) {

        $("#assignmentCompleteId").removeClass('uk-hidden');
        //TODO: 
        // Send an event message tracked
        // Send database message indicating state
        // Setup a task complete page
        // Allow the student to fill out a self-assessment.
    }
    else {
        $("#assignmentCompleteId").addClass('uk-hidden');
    }
}