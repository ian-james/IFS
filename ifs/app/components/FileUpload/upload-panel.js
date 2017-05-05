 /*$(function() {
    var bar = $('#progressbar')[0];
    UIkit.upload('.upload-panel', {
        url: '/tool_upload',
        multiple: true,
        data: new FormData($('#uploadForm')[0]),
        processData: false,
        contentType: false,
        beforeSend: function() { console.log('beforeSend', arguments); },
        beforeAll: function() { console.log('beforeAll', arguments); },
        load: function() { console.log('load', arguments); },
        error: function() { console.log('error', arguments); },
        complete: function() { console.log('complete', arguments); },

        loadStart: function (e) {
            //console.log('loadStart', arguments);

            bar.removeAttribute('hidden');
            bar.max =  e.total;
            bar.value =  e.loaded;

            console.log($('#uploadForm')[0]);
        },

        progress: function (e) {
            //console.log('progress', arguments);

            bar.max =  e.total;
            bar.value =  e.loaded;

        },

        loadEnd: function (e) {
            //console.log('loadEnd', arguments);

            bar.max =  e.total;
            bar.value =  e.loaded;
        },

        completeAll: function () {
            //console.log('completeAll', arguments);

            setTimeout(function () {
                bar.setAttribute('hidden', 'hidden');
            }, 1000);

        }
    });

});
*/
