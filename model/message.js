const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const currencies = require('country-data').currencies;

module.exports = mongoose.model('Message', new Schema({
    userId: {
        type: Number,
        required: true
    },
    currencyFrom: {
        type: String,
        required: true,
        validate: {
            validator: (currency) => {
                return _.isPlainObject(currencies[currency]) && currencies[currency].decimals !== null
            },
            message: 'currencyFrom must be a valid currency code'
        }
    },
    currencyTo: {
        type: String,
        required: true,
        validate: {
            validator: (currency) => {
                return _.isPlainObject(currencies[currency]) && currencies[currency].decimals !== null
            },
            message: 'currencyTo must be a valid currency code'
        }
    },
    amountSell: {
        type: Number,
        required: true
    },
    amountBuy: {
        type: Number,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    timePlaced: {
        type: String,
        required: false,
        default: moment().format('DD-MMM-YY HH:mm:ss')
    },
    originatingCountry: {
        type: String,
        required: true
    }
}));