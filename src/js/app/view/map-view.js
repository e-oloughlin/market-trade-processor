/**
 * A backbone view for the map of messages
 */
define('app/view/map-view', [
    'backbone',
    'config/google-map',
    'util/pubsub',
    'app/view/marker-view',
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyCY93WW0tiYqWeRh-GOiIzGj9QvO_ou33s'
], function(Backbone, mapConfig, pubsub, marker) {

    return Backbone.View.extend({

        el: '#map-container',

        initialize: function() {
            this.$map = $('<div id="map"/>');

            this.$el.html(this.$map);

            this.$map.css('height', this.$el.outerHeight());

            this.render();
        },

        render: function() {
            var that = this;

            that.map = new google.maps.Map(that.$map[0], _.extend({}, mapConfig, {
                zoom: 3,
                center: {
                    lat: 12, lng: -15
                }
            }));

            pubsub.subscribe('marker-focus', function(position) {
                that.map.panTo(position);
            });

            // Create and plot a marker on the map for each message in the collection
            that.collection.forEach(function(model) {
                new marker(model.getFormat('map-marker')).plot(that.map);
            });

            // When a message gets added to the collection,
            // create and plot a marker for it, and pan the map to the new marker
            that.collection.on('add', function(model) {
                var markerData = model.getFormat('map-marker');

                new marker(markerData).plot(that.map).focus();

                that.map.panTo(markerData.country.position);
            });
        }

    });

});