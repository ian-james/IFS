// Wait for the DOM to be ready
$(function() {
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("form").validate({
        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            firstname: "required",
            lastname: "required",
            username: { // this is the email field
                required: true,
                // Specify that email should be validated
                // by the built-in "email" rule
                email: true
            },
            password: {
                required: true,
                minlength: 8
            },
            password_again: {
                required: true,
                minlength: 8,
                equalTo: "#pwd"
            }
        },
        // Specify validation error messages
        messages: {
            firstname: "Please enter your firstname",
            lastname: "Please enter your lastname",
            username: {
                required: "Please enter a valid email address",
                email: "Your email must be in the form of name@domain.com"
            },
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 8 characters long"
            },
            password_again: {
                required: "Please confirm your password",
                minlength: "Your password must be at least 8 characters long",
                equalTo: "Passwords do not match"
            }
        },
        highlight: function(element){
            $(element).addClass('uk-form-danger');
        },
        unhighlight: function(element){
            $(element).removeClass('uk-form-danger');
        },
        errorClass: "uk-text-danger uk-text-meta",
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function(form) {
            form.submit();
        },
    });
});
