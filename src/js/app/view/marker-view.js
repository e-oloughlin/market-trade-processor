define('app/view/marker-view', [
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyCY93WW0tiYqWeRh-GOiIzGj9QvO_ou33s'
], function() {

    /**
     * Constructor:
     * Initialize a new google map marker
     *
     * @param {Object}  data   See app/model/message-model@getFormat('map-marker')
     */
    var MarkerView = function(data) {
        var markerLocation = new google.maps.LatLng(data.country.position.lat, data.country.position.lng);

        this.marker = new google.maps.Marker({
            position: markerLocation,
            title: 'User: '+data.message.userId
        });

        return this;
    }

    /**
     * Plot this marker onto a provided map
     * @param  {google.maps.Marker}     A google maps marker instance
     * @return {Object}                 This view
     */
    MarkerView.prototype.plot = function(map) {
        this.marker.setMap(map);
    };

    return MarkerView;

});