require.config({
    paths: {
        domReady: 'lib/domReady/domReady',
        jquery: 'lib/jquery/dist/jquery',
        backbone: 'lib/backbone/backbone',
        underscore: 'lib/underscore/underscore',
        handlebars: 'lib/handlebars/handlebars',
        lodash: 'lib/lodash/lodash',
        bsTab: 'lib/bootstrap/js/tab',
        text: 'lib/text/text',
        socketio: '/socket.io/socket.io.js',
        async: 'lib/requirejs-plugins/src/async',
    },
    shim: {
        socketio: {
            exports: 'io'
        },
        bsTab: {
            deps: ['jquery']
        }
    }
});

require([
    'domReady',
    'jquery',
    'app/collection/message-collection',
    'app/view/table-view',
    'app/view/map-view',
    'bsTab'
], function(domReady, $, messageCollection, tableView, mapView) {
    var app = {
        messages: new messageCollection()
    };

    domReady(function() {
        var $nav = $('.navbar'),
            navMargin = parseFloat($nav.css('margin-bottom'));

        // Set each tab pane to have a max height of the viewport
        $('.tab-pane').css('height', $(window).height() - $nav.outerHeight() - (navMargin * 2));

        // Grab initial messages from the server
        app.messages.fetch().done(function() {
            // Initialize the map view
            app.mapView = new mapView();

            // Initialize a new table view for all messages
            app.tableView = new tableView({
                collection: app.messages
            });

            // Listen for any further live additions (socket.io)
            app.messages.on('add', app.tableView.renderTableRow);
        });
    });
});