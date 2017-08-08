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

            // Set the height of the table to the window height
            this.$el.css('max-height', ($(window).height() - $('.navbar').outerHeight(true)));
        },

        /**
         * Render a table row for an individual message
         * @param  {Backbone.Model}
         */
        renderTableRow: function(model) {
            var data = _.extend({
                newRow: true
            }, model.toJSON()),

            $row = $(tableRow(data));

            this.$el.find('tbody').append($row);

            // Prevent the row being reanimated
            // when it goes out and into view again,
            // eg. when tabbing
            setTimeout(function() {
                $row.removeClass('green-flash');
            }, 2000)

            this.$el.stop().animate({
                scrollTop: this.$el.prop('scrollHeight')
            }, 750);
        }
    });

});