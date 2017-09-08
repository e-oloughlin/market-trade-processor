var $           = require('jquery'),
    Backbone    = require('backbone'),
    _           = require('underscore'),
    mapConfig   = require('../../config/google-map'),
    pubsub      = require('../../util/pubsub'),
    marker      = require('./marker-view'),
    googleMaps  = require('../../lib/google-maps');

module.exports = Backbone.View.extend({

    el: '#map-container',

    initialize: function() {
        this.$map = $('<div id="map"/>');

        this.$el.html(this.$map);

        this.$map.css('height', this.$el.outerHeight());

        this.render();
    },

    render: function() {
        var that = this;

        googleMaps.load(function() {
            that.map = new google.maps.Map(that.$map[0], _.extend({}, mapConfig, {
                zoom: 3,
                center: {
                    lat: 12, lng: -15
                }
            }));

            // Create and plot a marker on the map for each message in the collection
            that.collection.each(function(model) {
                that.addMarker(model);
            });

            // When a message gets added to the collection,
            // create and plot a marker for it, and pan the map to the new marker
            that.collection.on('add', function(model) {
                that.addMarker(model, true);
            });
        });
    },

    /**
     * Create and add a marker to the google map
     * @param {Backbone.Model}  model
     * @param {Boolean}         focus      Whether to focus on the marker
     */
    addMarker: function(model, focus) {
        var mapMarker = new marker(model.getFormat('map-marker')).plot(this.map);

        if(focus) mapMarker.focus();
    }

});