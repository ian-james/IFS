$(document).ready(function(){
    var task = 1;
    //  for classes modal
    $('#psycoptionsC').hide();
    $('#othoptionsC').hide();
    $('#ctype').change(function() {  
        var value = $('#ctype').val();
        if(value == 'computer science')
        {
            $('#csoptionsC').show();
            $('#psycoptionsC').hide();
            $('#othoptionsC').hide();
        }
        else if(value == 'psychology'){
            $('#csoptionsC').hide();
            $('#psycoptionsC').show();
            $('#othoptionsC').hide();
        }
        else{
            $('#csoptionsC').hide();
            $('#psycoptionsC').hide();
            $('#othoptionsC').show();
        }
    });

    function displayAssignmentOptions(){
        var value = $('#cnameA').val();
        value = JSON.parse(value);
        var discipline = value['cdiscipline'];
        if(discipline == 'computer science')
        {
            $('#csoptionsA').show();
            $('#psycoptionsA').hide();
            $('#othoptionsA').hide();
        }
        else if(discipline == 'psychology'){
            $('#csoptionsA').hide();
            $('#psycoptionsA').show();
            $('#othoptionsA').hide();
        }
        else{
            $('#csoptionsA').hide();
            $('#psycoptionsA').hide();
            $('#othoptionsA').show();
        }
    }


    //displayAssignmentOptions();
    // for assignment modal
    // $('#cnameA').change(function() {
    //    displayAssignmentOptions();
    // });

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

    $('#ccourse').submit(function(event) {
        event.preventDefault();
        $('.ccerror').remove();
        var strErr = '<div class="uk-alert-danger ccerror" uk-alert>';
        var endErr = '</div>';
        var err = 0;
        // check to make sure year is a valid number 
        if(isNaN($('#cyear').val())) {        
            $('#cContent').prepend(strErr + 'Error: Please enter in a valid year!' + endErr);
            err = 1;
        }

        // little regular expression snippet to check to make sure code follows rules
        if(/([A-Z])\w+\*(\d+)/.test($('#ccode').val()) == false) {
            $('#cContent').prepend(strErr + 'Error: Please enter in a valid class code.' + endErr);
            err = 1;
        }
        
        if (err) return;

        var formData = $("#ccourse :input[value!='']").serialize();
  
        $.ajax({
            url: '/instructor',
            type: 'post',
            data: {
                formData,
                form: 'createCourse'
            },
            timeout: 5000,
            success: function(msg){
                var modal = UIkit.modal('#create-course');
                modal.hide();
                $('#ccourse').trigger('reset');
                $('.ccerror').remove();
                UIkit.notification('Course created.', {'status': 'success'});
                setTimeout(function(){
                    window.location.reload(1);
                 }, 3000);
            },
            statusCode: {
                500: function() {
                    UIkit.notification('Failed to create course.', {'status': 'danger'});
                }
            }
            
        });

    });

    $('#cAss').submit(function(event) {
        event.preventDefault();
        $('.caerror').remove();
        var strErr = '<div class="uk-alert-danger caerror" uk-alert>';
        var endErr = '</div>';
        var err = 0;
        
        if (err) return;

        var formData = $("#cAss :input[value!='']").serialize();
  
        $.ajax({
            url: '/instructor',
            type: 'post',
            data: {
                formData,
                form: 'createAss'
            },
            timeout: 5000,
            success: function(msg){
                var modal = UIkit.modal('#create-assignment');
                modal.hide();
                $('#cAss').trigger('reset');
                $('.caerror').remove();
                UIkit.notification('Assignment created.', {'status': 'success'});
                setTimeout(function(){
                    window.location.reload(1);
                 }, 3000);
            },
            statusCode: {
                500: function() {
                    UIkit.notification('Failed to create assignment.', {'status': 'danger'});
                }
            }
            
        });

    });


    $('#cEvent').submit(function(event) {
        event.preventDefault();
        $('.ceerror').remove();
        var strErr = '<div class="uk-alert-danger ceerror" uk-alert>';
        var endErr = '</div>';
        var err = 0;
        
        if (err) return;

        var formData = $("#cEvent :input[value!='']").serialize();
  
        $.ajax({
            url: '/instructor',
            type: 'post',
            data: {
                formData,
                form: 'createEvent'
            },
            timeout: 5000,
            success: function(msg){
                var modal = UIkit.modal('#create-event');
                modal.hide();
                $('#cEvent').trigger('reset');
                $('.ceerror').remove();
                UIkit.notification('Event created.', {'status': 'success'});
                setTimeout(function(){
                    window.location.reload(1);
                 }, 3000);
            },
            statusCode: {
                500: function() {
                    UIkit.notification('Failed to create event.', {'status': 'danger'});
                }
            }
            
        });

    });

});