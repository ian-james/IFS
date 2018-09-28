$(document).ready(function(){
    var task = 1;
    //  for classes modal
    // THIS IS NOT CURRENTLY USED IF WE WANT TO ADD STATISTICS JUST UNCOMMENT THE FUNCTION CALLS
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

    // DISPLAYS THE ASSIGNMENT OPTIONS
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

    // Used for creating tasks in assignments
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
        // append the inputs to the form
        $('#taskControls').before(tNameStart + tName + tNameEnd + tDescStart + tDesc + tDescEnd);
        task++;
    });

    // removes the input from the form
    $( "#removeTask" ).click(function() {
        if (task > 1)
        {
            task--;
            $("#task" + task).remove();
        }
    })

    // create course
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

        // only fetches inputs that have a value (this is to fix a problem with fetching statistic inputs)
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
                // hide the modal
                var modal = UIkit.modal('#create-course');
                modal.hide();
                // reset the modal
                $('#ccourse').trigger('reset');
                $('.ccerror').remove();
                // send notification
                UIkit.notification('Course created.', {'status': 'success'});
                // refresh the page
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

    // create assignment
    $('#cAssign').submit(function(event) {
        event.preventDefault();
        $('.caerror').remove();
        var strErr = '<div class="uk-alert-danger caerror" uk-alert>';
        var endErr = '</div>';
        var err = 0;

        if (err) return;

        // only fetches inputs that have a value (this is to fix a problem with fetching statistic inputs)
        var formData = $("#cAssign :input[value!='']").serialize();

        $.ajax({
            url: '/instructor',
            type: 'post',
            data: {
                formData,
                form: 'createAssign'
            },
            timeout: 5000,
            success: function(msg){
                // hide the modal
                var modal = UIkit.modal('#create-assignment');
                modal.hide();
                // reset the modal
                $('#cAssign').trigger('reset');
                $('.caerror').remove();
                // send the notification
                UIkit.notification('Assignment created.', {'status': 'success'});
                // refresh page
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

    // create event
    $('#cEvent').submit(function(event) {
        event.preventDefault();
        $('.ceerror').remove();
        var strErr = '<div class="uk-alert-danger ceerror" uk-alert>';
        var endErr = '</div>';
        var err = 0;

        if (err) return;
        // only fetches inputs that have a value (this is to fix a problem with fetching statistic inputs)
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
                // hide modal
                var modal = UIkit.modal('#create-event');
                modal.hide();
                // reset modal
                $('#cEvent').trigger('reset');
                $('.ceerror').remove();
                // send notification
                UIkit.notification('Event created.', {'status': 'success'});
                // refresh page
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