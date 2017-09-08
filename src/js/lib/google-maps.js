var loadGoogleMaps  = require('load-google-maps-api'),
    key             = require('../config/app').keys.google;

/**
 * Load the google maps api or ensure it
 * has already been loaded prior to running
 * a callback.
 * @param  {Function}   callback
 */
exports.load = function(callback) {
    if(window.google) {
        return callback.call();
    }

    loadGoogleMaps({key: key}).then(function() {
        callback.call();
    });
};