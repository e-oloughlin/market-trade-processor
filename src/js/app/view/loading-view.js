define('app/view/loading-view', [
    'backbone',
    'text!templates/loader.hbs'
], function(Backbone, loaderTemplate) {

    var loadingView = function($parent) {
        this.$loader = $(loaderTemplate);

        $parent.html(this.$loader);

        return this;
    };

    loadingView.prototype.remove = function() {
        this.$loader.remove();
    };

    return loadingView;

});