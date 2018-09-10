$(document).ready(function(){
    // fetch the number of tasks that have been displayed
    if( $('#at').length )         // use this if you are using id to check
    {
        var task = document.getElementById('at').value;
    }
    $('#updateAssignment').submit(function(event) {
        event.preventDefault();
        // only fetches inputs that have a value (this is to fix a problem with fetching statistic inputs)
        var formData = $("#updateAssignment :input[value!='']").serialize();

        $.ajax({
            url: '/instructor-manage-confirm',
            type: 'post',
            data: {
                formData,
                form: 'updateAssign'
            },
            timeout: 5000,
            success: function(msg){
                // send notification
                UIkit.notification('Assignment updated...sending you back to panel.', {'status': 'success'});
                // redirect to instructor dashboard
                window.setTimeout(function(){
                    window.location.href = "/instructor";
                }, 5000);
            },
            statusCode: {
                500: function() {
                    UIkit.notification('Failed to update assignment.', {'status': 'danger'});
                }
            }

        });
    });

    $('#updateCourse').submit(function(event) {
        event.preventDefault();

        // only fetches inputs that have a value (this is to fix a problem with fetching statistic inputs)
        var formData = $("#updateCourse :input[value!='']").serialize();

        $.ajax({
            url: '/instructor-manage-confirm',
            type: 'post',
            data: {
                formData,
                form: 'updateCourse'
            },
            timeout: 5000,
            success: function(msg){
                // send notification
                UIkit.notification('Course updated...sending you back to panel.', {'status': 'success'});
                // redirect to instructor page
                window.setTimeout(function(){
                    window.location.href = "/instructor";
                }, 5000);
            },
            statusCode: {
                500: function() {
                    UIkit.notification('Failed to update course.', {'status': 'danger'});
                }
            }

        });
    });

    $('#deleteAssign').submit(function(event) {
        event.preventDefault();

        // only fetches inputs that have a value (this is to fix a problem with fetching statistic inputs)
        var formData = $("#deleteAssign :input[value!='']").serialize();

        $.ajax({
            url: '/instructor-delete',
            type: 'post',
            data: {
                formData,
                form: 'deleteAss'
            },
            timeout: 5000,
            success: function(msg){
                // hide modal
                var modal = UIkit.modal('#delete-assignment');
                modal.hide();
                // reset modal
                $('#deleteAssign').trigger('reset');
                // send notification
                UIkit.notification('Assignment deleted .. sending you back to panel.', {'status': 'success'});
                // redirect to instructor dashboard
                window.setTimeout(function(){
                    window.location.href = "/instructor";
                }, 5000);
            },
            statusCode: {
                500: function() {
                    UIkit.notification('Failed to delete assignment.', {'status': 'danger'});
                }
            }

        });
    });

    $('#updateEvent').submit(function(event) {
        event.preventDefault();

        // only fetches inputs that have a value (this is to fix a problem with fetching statistic inputs)
        var formData = $("#updateEvent :input[value!='']").serialize();

        $.ajax({
            url: '/instructor-manage-confirm',
            type: 'post',
            data: {
                formData,
                form: 'updateEvent'
            },
            timeout: 5000,
            success: function(msg){
                // send notification
                UIkit.notification('Event updated...sending you back to panel.', {'status': 'success'});
                // redirect to instructor dashboard apge
                window.setTimeout(function(){
                    window.location.href = "/instructor";
                }, 5000);
            },
            statusCode: {
                500: function() {
                    UIkit.notification('Failed to update event.', {'status': 'danger'});
                }
            }

        });
    });

    $('#deleteEvent').submit(function(event) {
        event.preventDefault();

        // only fetches inputs that have a value (this is to fix a problem with fetching statistic inputs)
        var formData = $("#deleteEvent :input[value!='']").serialize();

        $.ajax({
            url: '/instructor-delete',
            type: 'post',
            data: {
                formData,
                form: 'deleteEvent'
            },
            timeout: 5000,
            success: function(msg){
                // hide modal
                var modal = UIkit.modal('#delete-event');
                modal.hide();
                // reset modal
                $('#deleteEvent').trigger('reset');
                // send notification
                UIkit.notification('Event deleted .. sending you back to panel.', {'status': 'success'});
                // redirect to instructor dashboard
                window.setTimeout(function(){
                    window.location.href = "/instructor";
                }, 5000);
            },
            statusCode: {
                500: function() {
                    UIkit.notification('Failed to delete event.', {'status': 'danger'});
                }
            }

        });
    });

    // append task input to form
    $( "#addTask" ).click(function() {
        var tNameStart = `<div id='task${task}'><label class="uk-form-label" for="Task #${task} Name">Task #${task} Name</label>
                            <div class="uk-form-controls">`;
        if (task > 1)
            tNameStart = '<br>' + tNameStart;
        var tName = '<input class="uk-input" name="tName' + task + '" placeholder="e.g Tutor session" required="required" type="text">';
        var tNameEnd = '</div><br>';
        var tDescStart = `<label class="uk-form-label" for="Task #${task} Description">Task #${task} Description</label>
                            <div class="uk-form-controls">`;
        var tDesc = '<input class="uk-input" name="tDesc' + task + '" placeholder="e.g Learn C" required="required" type="text">';
        var tDescEnd = '</div></div>';
        // addTask
        $('#taskControls').before(tNameStart + tName + tNameEnd + tDescStart + tDesc + tDescEnd);
        task++;
    });

    // remvoe task input from form
    $( "#removeTask" ).click(function() {
        if (task > 1)
        {
            task--;
            $("#task" + task).remove();
        }
    })
});