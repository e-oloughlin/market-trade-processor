const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const Promise = require('bluebird');
const currencies = require('country-data').currencies;
const Message = require('../model/message');
const Errors = require('../config/errors').get('model').Message;

// A valid message object
const data = {
    userId: 134256,
    currencyFrom: 'EUR',
    currencyTo: 'GBP',
    amountSell: 1000,
    amountBuy: 747.10,
    rate: 0.7471,
    timePlaced: '24-JAN-15 10:27:44',
    originatingCountry: 'FR'
};

describe('Message', () => {
    /**
     * Set up DB connection
     */
    before((done) => {
        mongoose.connect('mongodb://127.0.01/market-trade-test-db', {
            useMongoClient: true
        });

        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

        mongoose.connection.once('open', () => {
            done();
        });
    });

    describe('userId', () => {
        it('should be a number', (done) => {
            /**
             * First, verify bad data will fail validation
             */
            const testIds = ['fifty six', null];

            Promise.all(testIds.map((userId) => {
                const msg = Object.assign({}, data, { userId });

                return new Message(msg).save().reflect();
            })).each((inspection) => {
                const result = inspection.reason();

                expect(result).to.be.an('object');
                expect(result).to.have.property('errors');

            }).then(() => {
                /**
                 * Then, verify good data will pass validation
                 */
                const msg = Object.assign({}, data, {
                    userId: 457
                });

                new Message(msg).save((err, message) => {
                    expect(err).to.equal(null);
                    expect(message).to.be.an('object');
                    expect(message).to.have.property('_id');

                    done();
                });
            });
        });
    });

    describe('currencyFrom', () => {
        it('should be a valid currency code', (done) => {
            /**
             * First, verify bad data will fail validation
             */
            const testCurrencies = [45, false, 'some string that is not a currency code'];

            Promise.all(testCurrencies.map((currency) => {
                const msg = Object.assign({}, data, {
                    currencyFrom: currency
                });

                return new Message(msg).save().reflect();
            })).each((inspection) => {
                const result = inspection.reason();

                expect(result).to.be.an('object');
                expect(result.errors).to.have.property('currencyFrom');
                expect(result.errors.currencyFrom.message).to.equal(Errors.currencyFrom);

            }).then(() => {
                /**
                 * Then, verify good data will pass validation
                 */
                const validCurrencyCode = currencies[Object.keys(currencies)[10]].code; // Random valid currency code

                const msg = Object.assign({}, data, {
                    currencyFrom: validCurrencyCode
                });

                new Message(msg).save((err, message) => {
                    expect(err).to.equal(null);
                    expect(message).to.be.an('object');
                    expect(message).to.have.property('_id');

                    done();
                });
            });
        });
    });

    describe('currencyTo', () => {
        it('should be a valid currency code', (done) => {
            /**
             * First, verify bad data will fail validation
             */
            const testCurrencies = [45, false, 'somestringthatisnotacurrencycode'];

            Promise.all(testCurrencies.map((currency) => {
                const msg = Object.assign({}, data, {
                    currencyTo: currency
                });

                return new Message(msg).save().reflect();
            })).each((inspection) => {
                const result = inspection.reason();

                expect(result).to.be.an('object');
                expect(result.errors).to.have.property('currencyTo');
                expect(result.errors.currencyTo.message).to.equal(Errors.currencyTo);

            }).then(() => {
                /**
                 * Then, verify good data will pass validation
                 */
                const validCurrencyCode = currencies[Object.keys(currencies)[20]].code; // Random valid currency code

                const msg = Object.assign({}, data, {
                    currencyTo: validCurrencyCode
                });

                new Message(msg).save((err, message) => {
                    expect(err).to.equal(null);
                    expect(message).to.be.an('object');
                    expect(message).to.have.property('_id');

                    done();
                });
            });
        });
    });

    describe('amountSell', () => {
        it('should be a valid number', (done) => {
            const msg = Object.assign({}, data, {
                amountSell: 'twentysix',
            });

            new Message(msg).save((err, message) => {
                expect(err).to.be.an('object');
                expect(err.errors).to.have.property('amountSell');

                done();
            });
        });
    });

    describe('Valid data', () => {
        it('should save successfully', (done) => {
            new Message(data).save((err, message) => {
                expect(message).to.be.an('object');

                done();
            });
        });
    });

    /**
     * Close DB connection
     */
    after((done) => {
        mongoose.disconnect();

        done();
    });
});