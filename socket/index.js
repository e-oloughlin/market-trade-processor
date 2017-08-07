/**
 * Socket io module.
 * Place all subscriptions in here.
 */
const socketio = require('socket.io');
const pubsub = require('pubsub-js');

module.exports.listen = function(app) {
    let io = socketio.listen(app);

    io.on('connection', function(socket) {
        console.log('new connection');

        pubsub.subscribe('new-message', function(topic, message) {
            io.emit('new-message', message);
        });

        socket.on('disconnect', function() {
            console.log('disconnected');
        });
    });

    return io;
}