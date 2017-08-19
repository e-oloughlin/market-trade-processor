// Dependencies
var Backbone = require('backbone'),
    io = require('socket.io-client'),
    config = require('../../config/app'),
    messageModel = require('../model/message-model');

/**
 * Socket.io object
 * @type {Object}
 */
var socket = io.connect(location.origin);

module.exports = Backbone.Collection.extend({
    url: config.api.message,

    model: messageModel,

    initialize: function() {
        var that = this;

        // When messages are added to this collection,
        // render a row for them in the table
        socket.on('new-message', function(message) {
            if(!that.get(message._id)) {
                that.add(message);
            }
        });
    }
});