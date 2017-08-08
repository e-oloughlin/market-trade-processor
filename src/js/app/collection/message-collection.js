define('app/collection/message-collection', [
    'backbone',
    'socketio',
    'config'
], function(Backbone, io, config) {

    /**
     * Socket.io object
     * @type {Object}
     */
    var socket = io.connect(location.origin);

    return Backbone.Collection.extend({
        url: config.api.message,

        initialize: function() {
            var that = this;

            // When messages are added to this collection,
            // render a row for them in the table
            socket.on('new-message', function(message) {
                if(!that.get(message._id)) {
                    that.add(message);
                }
            });
        },

        /**
         * Specify an _id property to be the unique
         * identifier for models in this collection
         */
        modelId: function(attrs) {
            return attrs._id;
        }
    });

});