var socket = io();

/**
 * This function updates the progress of backend tasks and changes wait modal title.
 * @param  {[type]} data) {               var title [description]
 * @return {[type]}       [description]
 */
socket.on('ifsProgress', function(data) {
    var title = $("#modalTitle");
    title.text("Processing Files please wait...");
    var progressBar = $('#progressbar')[0];
    progressBar.max =  100;
    progressBar.value =  data.progress;
});
