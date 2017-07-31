const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const currencies = require('country-data').currencies;
const Errors = require('../config/errors').get('model').Message;

module.exports = mongoose.model('Message', new Schema({
    userId: {
        type: Number,
        required: true,
        validate: {
            validator: (num) => {
                return num % 1 === 0;
            },
            message: Errors.userId
        }
    },
    currencyFrom: {
        type: String,
        required: true,
        validate: {
            validator: (currency) => {
                return _.isPlainObject(currencies[currency]) && currencies[currency].decimals !== null
            },
            message: Errors.currencyFrom
        }
    },
    currencyTo: {
        type: String,
        required: true,
        validate: {
            validator: (currency) => {
                return _.isPlainObject(currencies[currency]) && currencies[currency].decimals !== null
            },
            message: Errors.currencyTo
        }
    },
    amountSell: {
        type: Number,
        required: true,
        validate: {
            validator: (num) => {
                // Prevent the summission of false as a property value
                return typeof num === 'number' && num >= 1;
            }
        }
    },
    amountBuy: {
        type: Number,
        required: true,
        validate: {
            validator: (num) => {
                // Prevent the summission of false as a property value
                return typeof num === 'number' && num >= 1;
            }
        }
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