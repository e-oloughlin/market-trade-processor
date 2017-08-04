require.config({
    paths: {
        domReady: 'lib/domReady/domReady',
        jquery: 'lib/jquery/dist/jquery',
        backbone: 'lib/backbone/backbone',
        underscore: 'lib/underscore/underscore',
        handlebars: 'lib/handlebars/handlebars',
        lodash: 'lib/lodash/lodash',
        bsTab: 'lib/bootstrap/js/tab',
        text: "lib/text/text"
    },
    shim: {
        'bsTab': {
            deps: ['jquery']
        }
    }
});

require([
    'domReady',
    'jquery',
    'app/collection/message-collection',
    'app/view/table-view',
    'bsTab'
], function(domReady, $, messageCollection, tableView) {
    var app = {
        messages: new messageCollection()
    };

    domReady(function() {
        app.messages.fetch().done(function() {
            app.tableView = new tableView({
                collection: app.messages
            });

            app.tableView.render();
        });
    });
});