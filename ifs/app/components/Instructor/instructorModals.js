$(document).ready(function(){
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

});