define('app/collection/message-collection', [
    'backbone',
    'config'
], function(Backbone, config) {

    return Backbone.Collection.extend({
        url: config.api.message
    });

});