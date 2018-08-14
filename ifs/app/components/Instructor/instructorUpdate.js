$(document).ready(function(){
    var task = document.getElementById('at').value;
    $('#updateAssignment').submit(function(event) {
        event.preventDefault();
        
        var formData = $("#updateAssignment :input[value!='']").serialize();
  
        $.ajax({
            url: '/instructor-manage-confirm',
            type: 'post',
            data: {
                formData,
                form: 'updateAss'
            },
            timeout: 5000,
            success: function(msg){
                UIkit.notification('Assignment updated...sending you back to panel.', {'status': 'success'});
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
                UIkit.notification('Course updated...sending you back to panel.', {'status': 'success'});
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

    $('#dAss').submit(function(event) {
        event.preventDefault();
        
        var formData = $("#dAss :input[value!='']").serialize();
  
        $.ajax({
            url: '/instructor-delete',
            type: 'post',
            data: {
                formData,
                form: 'deleteAss'
            },
            timeout: 5000,
            success: function(msg){
                var modal = UIkit.modal('#delete-assignment');
                modal.hide();
                $('#dAss').trigger('reset');
                UIkit.notification('Assignment deleted .. sending you back to panel.', {'status': 'success'});
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
                UIkit.notification('Event updated...sending you back to panel.', {'status': 'success'});
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

    $('#dEvent').submit(function(event) {
        event.preventDefault();
        
        var formData = $("#dEvent :input[value!='']").serialize();
  
        $.ajax({
            url: '/instructor-delete',
            type: 'post',
            data: {
                formData,
                form: 'deleteEvent'
            },
            timeout: 5000,
            success: function(msg){
                var modal = UIkit.modal('#delete-event');
                modal.hide();
                $('#dEvent').trigger('reset');
                UIkit.notification('Event deleted .. sending you back to panel.', {'status': 'success'});
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
        $('#taskControls').before(tNameStart + tName + tNameEnd + tDescStart + tDesc + tDescEnd);
        task++;
    });

    $( "#removeTask" ).click(function() {
        if (task > 1)
        {
            task--;
            $("#task" + task).remove();
        }
    })
});