// Dependencies
var $           = require('jquery'),
    _           = require('underscore'),
    pubsub      = require('../../util/pubsub'),
    messageInfo = require('../../templates/info-window.hbs'),
    googleMaps  = require('../../lib/google-maps');

// Google Maps Info Widow
// See: https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple
var infoWindow;

/**
 * Constructor:
 * Initialize a new google map marker
 *
 * @param {Object}  data   See app/model/message-model@getFormat('map-marker')
 */
var MarkerView = function(data) {
    _.bindAll(this, 'focus');

    googleMaps.load(_.bind(function() {
        if(typeof infoWindow === 'undefined') {
            infoWindow = new google.maps.InfoWindow({
                maxWidth: 200
            });
        }

        this.data = data;

        this.position = new google.maps.LatLng(data.country.position.lat, data.country.position.lng);

        this.marker = new google.maps.Marker({
            position: this.position,
            title: 'User: '+data.message.userId
        });
    }, this));

    return this;
};

/**
 * Plot this marker onto a provided map
 * @param  {google.maps.Marker}     A google maps marker instance
 * @return {Object}                 This view
 */
MarkerView.prototype.plot = function(map) {
    this.map = map;

    this.marker.setMap(this.map);

    this.marker.addListener('click', this.focus);

    return this;
};

/**
 * Focus on a marker - center the map on it,
 * re render the infowindow's content and
 * show the infowindow
 * @return {Object}     This view
 */
MarkerView.prototype.focus = function() {
    infoWindow.setContent(messageInfo(this.data));
    infoWindow.setPosition(this.position);
    infoWindow.open(this.map, this.marker);

    this.map.panTo(this.position);

    $('.info-window .btn').click(function(e) {
        pubsub.publish('go-to-row', $(e.target).data('id'));
    });

    return this;
};

module.exports = MarkerView;