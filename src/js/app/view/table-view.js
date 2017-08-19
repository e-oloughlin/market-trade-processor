var $           = require('jquery'),
    _           = require('underscore'),
    Backbone    = require('backbone'),
    handlebars  = require('hbsfy/runtime'),
    bootstrap   = require('bootstrap'),
    pubsub      = require('../../util/pubsub'),
    table       = require('../../templates/table.hbs'),
    tableRow    = require('../../templates/table-row.hbs');

// Register a table row partial for use within
// a parent table template
handlebars.registerPartial('table-row', tableRow);

module.exports = Backbone.View.extend({
    el: '#message-list',

    initialize: function(options) {
        // Ensure the context of renderTableRow is always this view
        _.bindAll(this, 'renderTableRow', 'highlightRow');

        if(options.collection) {
            this.render();
        }
    },

    /**
     * Render a table of all messages
     * @return {Object}    This view
     */
    render: function() {
        this.$el.html(table(this.collection.toJSON()));

        pubsub.subscribe('go-to-row', this.highlightRow);

        return this;
    },

    /**
     * Show this table tab
     * @return {Object}    This view
     */
    showTable: function() {
        $('a[href="#'+this.el.id+'"]').tab('show');

        return this;
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

        this.scrollToRow(model.get('_id'));

        this.unHighlightRow($row);
    },

    /**
     * Return a row by its id attribute
     * @param  {Number}
     * @return {jQuery}
     */
    getRow: function(id) {
        return this.$el.find('[data-id="'+id+'"]');
    },

    /**
     * Highlight a row
     * @param  {Number} id      id attribute of row
     */
    highlightRow: function(id) {
        this.showTable();

        var $row = this.getRow(id);

        this.scrollToRow(id);

        $row.addClass('green-flash');

        this.unHighlightRow($row);
    },

    /**
     * Scroll to a particular row
     * @param  {Number} id      id attribute of row
     */
    scrollToRow: function(id) {
        this.$el.stop().animate({
            scrollTop: this.getRow(id).position().top
        }, 750);
    },

    /**
     * Prevent the row being reanimated
     * when it goes out and into view again,
     * eg. when tabbing
     * @param  {jQuery}     $row
     */
    unHighlightRow: function($row) {
        setTimeout(function() {
            $row.removeClass('green-flash');
        }, 2000)
    }
});