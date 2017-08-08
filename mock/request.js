/**
 * Handy for posting a random, valid message object
 * to the api
 */
const request = require('request');
const moment = require('moment');
const _ = require('lodash');
const countries = require('country-data').countries;
const currencies = require('country-data').currencies;

function getRandomCountry() {
    let country = _.find(_.shuffle(countries), {
        status: 'assigned'
    });

    return country.alpha2;
}

function getRandomCurrency() {
    return _.sample(_.reject(currencies, {
        code: 'XXX'
    })).code;
}

function getRandomFloat() {
    return (Math.random() * (0.120 - 0.0200) + 0.0200).toFixed(4);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = function(uri) {
    if(!uri) {
        return console.log('uri required');
    }

    let data = {
        userId: getRandomInt(100, 1000),
        currencyFrom: getRandomCurrency(),
        currencyTo: getRandomCurrency(),
        amountSell: getRandomInt(50, 1500),
        amountBuy: getRandomFloat(),
        rate: getRandomFloat(),
        timePlaced: (moment().format('DD-MMM-YY HH:mm:ss')).toUpperCase(),
        originatingCountry: getRandomCountry()
    };

    let options = {
        uri,
        method: 'POST',
        json: data
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
        } else if(!error && response.statusCode === 200) {
            console.log(body);
        }
    });
};