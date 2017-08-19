var alreadyLoaded = false,
    loadGoogleMaps  = require('load-google-maps-api'),
    key             = require('../config/app').keys.google;

exports.load = function(callback) {
    if(alreadyLoaded) {
        return callback.call();
    }

    loadGoogleMaps({key: key}).then(function() {
        alreadyLoaded = true;
        callback.call();
    });
};