$(function(){
    $('.studentInput').on('change', function() {

        //constants relating to studentSkill.pug
        var inputName = "numeric";
        var progressName = "prog"
        var hiddenName = "userHidden";

        var sVal = Math.min(100, Math.max(0, $(this).val()));
        var inputId = $(this).attr('id');
        var idVal = inputId.substr( inputName.length );

        var progress = $('#'+ progressName + idVal );

        if(progress) {
            // Change the progress bar.
            progress.val(sVal);
            var hidden = $('#' + hiddenName + idVal);
            if(hidden) {
                // Set hidden to have changed to track.
                hidden.val('yes');
            }
        }
    });
});