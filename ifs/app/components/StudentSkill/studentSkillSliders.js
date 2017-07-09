$(function(){
    $('.studentInput').on('change', function() {
        sVal = $(this).val();
        var progress = $(this).next('progress');
        if(progress) {
            progress.val(sVal);
        }
    });
});