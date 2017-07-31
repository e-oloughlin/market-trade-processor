module.exports = (schema, options) => {
    schema.add({
        timePlaced: Date
    });

    schema.pre('save', function (next) {
        this.timePlaced = new Date();

        next();
    });

    if (options && options.index) {
        schema.path('timePlaced').index(options.index);
    }
}