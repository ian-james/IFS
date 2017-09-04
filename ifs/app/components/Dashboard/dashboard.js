 var socket = io(); 

/**
 * This function emits a messages that student assignment task has changed.
 * Status of all checkboxes for assignment tasks are checked to see if 'all'
 * indicating that the assignment is completed.
 * Param: input is from HTML and refers to the skill checkbox.
 */

 function onCheckboxClick( input ) {
    var assignmentTaskId = parseInt($(input).attr('data-assignment-task'));
    var studentId = parseInt($(input).attr('data-student'));

    var checked = false;
    if( $(input).is(':checked') )
        checked = true;

    socket.emit("studentAssignmentTaskEvent", {
        "studentId": studentId,
        "assignmentTaskId": assignmentTaskId,
        "eventType": "finishedTask",
        "name": assignmentTaskId,
        "data": checked
    });

    if($("input[type='checkbox']:checked").length == $("input[type='checkbox']").length ) {
        $("#assignmentCompleteId").removeClass('uk-hidden');
    }
    else {
        $("#assignmentCompleteId").addClass('uk-hidden');
    }
}