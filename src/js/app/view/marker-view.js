define('app/view/marker-view', [
    'text!templates/info-window.hbs',
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyCY93WW0tiYqWeRh-GOiIzGj9QvO_ou33s'
], function(infoWindowTemplate) {

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

        this.infowindow = new google.maps.InfoWindow({
            content: infoWindowTemplate
        });

        return this;
    };

    /**
     * Plot this marker onto a provided map
     * @param  {google.maps.Marker}     A google maps marker instance
     * @return {Object}                 This view
     */
    MarkerView.prototype.plot = function(map) {
        var that = this;

        that.marker.setMap(map);

        that.marker.addListener('click', function() {
            that.infowindow.open(map, that.marker);
        });
    };

    return MarkerView;

});