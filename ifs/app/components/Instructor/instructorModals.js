$(document).ready(function(){
    $('#cerror').hide();

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

    displayAssignmentOptions();
    // for assignment modal
    $('#cnameA').change(function() {
        displayAssignmentOptions();
    });

    $('#ccourse').submit(function(event) {
        event.preventDefault();
        var strErr = '<div class="uk-alert-danger cerror" uk-alert>';
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

        var formData = $('#ccourse').serialize();
        console.log(formData);
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
                $('.cerror').remove();
                UIkit.notification('Course created.', {'status': 'success'});
            },
            statusCode: {
                500: function() {
                    UIkit.notification('Failed to create course.', {'status': 'danger'});
                }
            }
            
        });

    });

});