/**
 * A backbone view for the map of messages
 */
define('app/view/map-view', [
    'backbone',
    'config/google-map',
    'app/view/marker-view',
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyCY93WW0tiYqWeRh-GOiIzGj9QvO_ou33s'
], function(Backbone, mapConfig, marker) {

    return Backbone.View.extend({

        el: '#map-container',

        initialize: function() {
            this.$map = $('<div id="map"/>');

            this.$el.html(this.$map);

            this.$map.css('height', this.$el.outerHeight());

            this.render();
        },

        render: function() {
            this.map = new google.maps.Map(this.$map[0], _.extend({}, mapConfig, {
                zoom: 3,
                center: {
                    lat: 12, lng: -15
                }
            }));

            // Create and plot a marker on the map for each message in the collection
            this.collection.forEach(function(model) {
                new marker(model.getFormat('map-marker')).plot(this.map);
            }, this);

            // When a message gets added to the collection,
            // create and plot a marker for it, and pan the map to the new marker
            this.collection.on('add', function(model) {
                var markerData = model.getFormat('map-marker');

                new marker(markerData).plot(this.map).focus();

                this.map.panTo(markerData.country.position);
            }, this);
        }

    });

});