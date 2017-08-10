define('app/model/message-model', [
    'backbone'
], function(Backbone) {

    return Backbone.Model.extend({
        /**
         * Specify an _id property to be the unique
         * identifier for models in this collection
         */
        idAttribute: '_id',

        /**
         * Return the model data in a specific format
         * @param  {String} format
         * @return {Object}
         */
        getFormat: function(format) {
            if(format === 'map-marker') {
                return {
                    message: this.omit('countryInfo', '__v'),
                    country: {
                        name: this.get('countryInfo').name,
                        position: {
                            lat: this.get('countryInfo').latitude,
                            lng: this.get('countryInfo').longitude
                        }
                    }
                };
            }
        }
    });

});