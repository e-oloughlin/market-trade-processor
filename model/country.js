const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const isValidCoord = require('is-valid-coordinates');
const Errors = require('../config/errors').get('model');

const CountrySchema = new Schema({
    latitude: {
        type: Number,
        required: true,
        validate: {
            validator: (latitude) => {
                return isValidCoord.latitude(latitude);
            },
            message: Errors.Country.latitude
        }
    },
    longitude: {
        type: Number,
        required: true,
        validate: {
            validator: (longitude) => {
                return isValidCoord.longitude(longitude);
            },
            message: Errors.Country.longitude
        }
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Country', CountrySchema);