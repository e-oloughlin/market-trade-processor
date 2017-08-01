const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const currencies = require('country-data').currencies;
const countries = require('country-data').countries;
const Errors = require('../config/errors').get('model').Message;

const Message = new Schema({
    userId: {
        type: Number,
        required: true,
        validate: {
            validator: (num) => {
                return num > 0 && num % 1 === 0;
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
            validator: (amount) => {
                // Prevent the type casting of a submitted falsey value to 0
                return typeof amount === 'number' && amount > 0;
            },
            message: Errors.amountSell
        }
    },
    amountBuy: {
        type: Number,
        required: true,
        validate: {
            validator: (amount) => {
                // Prevent the type casting of a submitted falsey value to 0
                return typeof amount === 'number' && amount > 0;
            },
            message: Errors.amountBuy
        }
    },
    rate: {
        type: Number,
        required: true,
        validate: {
            validator: (rate) => {
                // Prevent the type casting of a submitted falsey value to 0
                return typeof rate === 'number' && rate > 0;
            },
            message: Errors.rate
        }
    },
    timePlaced: {
        type: String,
        required: true,
        validate: {
            validator: (date) => {
                // Regex for date format: DD-MMM-YY HH:mm:ss
                let regex = /^(0[1-9]|[1-2]\d|3[0-1])-([A-Z]{3})-(\d{2})\s(0[0-9]|1\d|2[0-3]):([0-5]\d):([0-5]\d)/;

                return typeof date === 'string' && regex.test(date);
            },
            message: Errors.timePlaced
        }
    },
    originatingCountry: {
        type: String,
        required: true,
        validate: {
            validator: (country) => {
                if(typeof country === 'string' && country.length > 0) {
                    return _.isPlainObject(countries[country]) && typeof countries[country].alpha2 === 'string';
                }

                return false;
            },
            message: Errors.originatingCountry
        }
    }
});

module.exports = mongoose.model('Message', Message);