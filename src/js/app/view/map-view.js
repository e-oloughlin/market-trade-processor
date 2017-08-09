/**
 * A backbone view for the map of messages
 */
define('app/view/map-view', [
    'backbone',
    'config/google-map',
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyCY93WW0tiYqWeRh-GOiIzGj9QvO_ou33s'
], function(Backbone, mapConfig) {

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

            var marker = new google.maps.Marker({
                position: {
                    lat: 12, lng: -15
                },
                map: this.map
            });
        }

    });

});