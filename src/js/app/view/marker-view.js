define('app/view/marker-view', [
    'underscore',
    'handlebars',
    'text!templates/info-window.hbs',
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyCY93WW0tiYqWeRh-GOiIzGj9QvO_ou33s'
], function(_, handlebars, infoWindowTemplate) {

    var createInfoWindow = handlebars.compile(infoWindowTemplate);

    var infoWindow = new google.maps.InfoWindow({
        maxWidth: 200
    });

    /**
     * Constructor:
     * Initialize a new google map marker
     *
     * @param {Object}  data   See app/model/message-model@getFormat('map-marker')
     */
    var MarkerView = function(data) {
        _.bindAll(this, 'focus');

        this.data = data;

        this.position = new google.maps.LatLng(data.country.position.lat, data.country.position.lng);

        this.marker = new google.maps.Marker({
            position: this.position,
            title: 'User: '+data.message.userId
        });

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

    MarkerView.prototype.focus = function() {
        infoWindow.setContent(createInfoWindow(this.data));

        infoWindow.setPosition(this.position);

        infoWindow.open(this.map, this.marker);
    }

    return MarkerView;

});