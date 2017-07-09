$(function(){
    $('.studentInput').on('change', function() {
        sVal = $(this).val();
        var progress = $(this).next('progress');
        if(progress) {
            // Change the progress bar.
            progress.val(sVal);
        }

        var hidden = progress.next('input');
        if(hidden) {
            // Set hidden to have changed to track.
            hidden.val('yes');
        }
    });
});