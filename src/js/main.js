require.config({
    paths: {
        domReady: 'lib/domReady/domReady',
        jquery: 'lib/jquery/dist/jquery'
    }
});

require([
    'domReady',
    'jquery',
    // 'util/pubsub',
], function(domReady, $, pubSub) {

    // When the DOM is ready
    domReady(function () {
        console.log('The DOM is ready!');
    });

});