$(function(){
    $('.studentInput').on('change', function() {
        var sVal = Math.min(100, Math.max(0, $(this).val()));
        var parent = $(this).parent();

        var pnext = parent.next();
        var progress = pnext.children('progress');

        if(progress) {
            // Change the progress bar.
            progress.val(sVal);
            var hidden = pnext.next();

            if(hidden) {
                // Set hidden to have changed to track.
                hidden.val('yes');
            }
        }
    });
});