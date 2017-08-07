/**
 * A backbone view for the main
 * table of messages
 */
define('app/view/table-view', [
    'backbone',
    'handlebars',
    'text!templates/table.hbs',
    'text!templates/table-row.hbs'
], function(Backbone, handlebars, tableTemplate, tableRowTemplate) {

    // Register a table row partial for use within
    // a parent table template
    handlebars.registerPartial('table-row', tableRowTemplate);

    // Compile the handlebars templates needed
    // for this view
    var table = handlebars.compile(tableTemplate),
        tableRow = handlebars.compile(tableRowTemplate);

    return Backbone.View.extend({
        el: '#message-list',

        initialize: function(options) {
            // Ensure the context of renderTableRow is always this view
            _.bindAll(this, 'renderTableRow');

            if(options.collection) {
                this.render();
            }
        },

        /**
         * Render a table of all messages
         */
        render: function() {
            this.$el.html(table(this.collection.toJSON()));
        },

        /**
         * Render a table row for an individual message
         * @param  {Backbone.Model}
         */
        renderTableRow: function(model) {
            this.$el.find('tbody').append(tableRow(model.toJSON()));
        }
    });

});