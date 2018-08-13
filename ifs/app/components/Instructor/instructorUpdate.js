$(document).ready(function(){
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
});