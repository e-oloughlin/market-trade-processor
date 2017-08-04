require.config({
    paths: {
        domReady: 'lib/domReady/domReady',
        jquery: 'lib/jquery/dist/jquery',
        bsTab: 'lib/bootstrap/js/tab'
    },
    shim: {
        'bsTab': {
            deps: ['jquery']
        }
    }
});

require([
    'domReady',
    'bsTab'
], function(domReady) {

});