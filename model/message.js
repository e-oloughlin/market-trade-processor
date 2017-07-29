let moment = require('moment');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
    userId: {
        type: Number,
        required: true
    },
    currencyFrom: {
        type: String,
        required: true
    },
    currencyTo: {
        type: String,
        required: true
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

let eg = {
    "userId": "134256",
    "currencyFrom": "EUR",
    "currencyTo": "GBP",
    "amountSell": 1000,
    "amountBuy": 747.10,
    "rate": 0.7471,
    "timePlaced": "24-JAN-15 10:27:44",
    "originatingCountry": "FR"
};