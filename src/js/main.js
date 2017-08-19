// Dependencies
var $ = require('jquery');

global.jQuery = $;

var bootstrap = require('bootstrap'),
    messageCollection = require('./app/collection/message-collection'),
    tableView = require('./app/view/table-view'),
    mapView = require('./app/view/map-view');

var app = {
    messages: new messageCollection()
};

// DOM Ready
$(function() {
    var $nav = $('.navbar'),
        navMargin = parseFloat($nav.css('margin-bottom'));

    // Set each tab pane to have a max height of the viewport
    $('.tab-pane').css('height', $(window).height() - $nav.outerHeight() - (navMargin * 2));

    // Grab initial messages from the server
    app.messages.fetch({
        data: {
            depth: 1 // Request child objects
        }
    }).done(function() {
        // Initialize the map view
        app.mapView = new mapView({
            collection: app.messages
        });

        // Initialize a new table view for all messages
        app.tableView = new tableView({
            collection: app.messages
        });

        // Listen for any further live additions (socket.io)
        app.messages.on('add', app.tableView.renderTableRow);
    });
});