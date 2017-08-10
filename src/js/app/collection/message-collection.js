define('app/collection/message-collection', [
    'backbone',
    'socketio',
    'config/app',
    'app/model/message-model'
], function(Backbone, io, config, messageModel) {

    /**
     * Socket.io object
     * @type {Object}
     */
    var socket = io.connect(location.origin);

    return Backbone.Collection.extend({
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

});