define('app/view/table-view', [
    'backbone',
    'handlebars',
    'text!templates/table.hbs'
], function(Backbone, handlebars, tableTemplate) {

    return Backbone.View.extend({
        el: '#message-list',

        initialize: function() {
            this.template = handlebars.compile(tableTemplate);
        },

        render: function() {
            return this.$el.html(this.template(this.collection.toJSON()));
        }
    });

});