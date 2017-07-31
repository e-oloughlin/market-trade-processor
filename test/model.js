const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const Promise = require('bluebird');
const currencies = require('country-data').currencies;
const countries = require('country-data').countries;
const Message = require('../model/message');
const config = require('../config/app').get(process.env.NODE_ENV);
const Errors = require('../config/errors').get('model');

// Set bluebird as mongoose's promise utility
mongoose.Promise = Promise;

// A valid message object
let data = require('../mock/data').message;

describe('Message', () => {
    /**
     * Set up DB connection
     */
    before((done) => {
        mongoose.connect(config.database, {
            useMongoClient: true
        });

        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

        mongoose.connection.once('open', () => {
            done();
        });
    });

    describe('userId', () => {
        it('should be a valid integer', (done) => {
            /**
             * First, verify bad data will fail validation
             */
            const testIds = ['fifty six', null, 78.456];

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
                expect(result).to.have.property('errors');
                expect(result.errors).to.have.property('currencyFrom');
                expect(result.errors.currencyFrom.message).to.equal(Errors.Message.currencyFrom);
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
                expect(result).to.have.nested.property('errors.currencyTo.message');
                expect(result.errors.currencyTo.message).to.equal(Errors.Message.currencyTo);
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
            /**
             * First, verify bad data will fail validation
             */
            const testAmounts = [false, null, 'twenty six'];

            Promise.all(testAmounts.map((amountSell) => {
                const msg = Object.assign({}, data, { amountSell });

                return new Message(msg).save().reflect();
            })).each((inspection) => {
                const result = inspection.reason();

                expect(result).to.be.an('object');
                expect(result).to.have.property('errors');
            }).then(() => {
                /**
                 * Then, verify good data will pass validation
                 */
                const msg = Object.assign({}, data, { amountSell: 45.78 });

                new Message(msg).save((err, message) => {
                    expect(err).to.be.null;
                    expect(message).to.be.an('object');
                    expect(message).to.have.property('_id');

                    done();
                });
            });
        });
    });

    describe('amountBuy', () => {
        it('should be a valid number', (done) => {
            /**
             * First, verify bad data will fail validation
             */
            const testAmounts = [false, null, 'fourty two'];

            Promise.all(testAmounts.map((amountBuy) => {
                const msg = Object.assign({}, data, { amountBuy });

                return new Message(msg).save().reflect();
            })).each((inspection) => {
                const result = inspection.reason();

                expect(result).to.be.an('object');
                expect(result).to.have.property('errors');
            }).then(() => {
                /**
                 * Then, verify good data will pass validation
                 */
                const msg = Object.assign({}, data, { amountBuy: 89.544 });

                new Message(msg).save((err, message) => {
                    expect(err).to.be.null;
                    expect(message).to.be.an('object');
                    expect(message).to.have.property('_id');

                    done();
                });
            });
        });
    });

    describe('rate', () => {
        it('should be a valid number', (done) => {
            /**
             * First, verify bad data will fail validation
             */
            const testRates = [false, null, 'ten'];

            Promise.all(testRates.map((rate) => {
                const msg = Object.assign({}, data, { rate });

                return new Message(msg).save().reflect();
            })).each((inspection) => {
                const result = inspection.reason();

                expect(result).to.be.an('object');
                expect(result).to.have.property('errors');
            }).then(() => {
                /**
                 * Then, verify good data will pass validation
                 */
                const msg = Object.assign({}, data, { rate: 0.89 });

                new Message(msg).save((err, message) => {
                    expect(err).to.be.null;
                    expect(message).to.be.an('object');
                    expect(message).to.have.property('_id');

                    done();
                });
            });
        });
    });

    describe('originatingCountry', () => {
        it('should be a valid country code', (done) => {
            /**
             * First, verify bad data will fail validation
             */
            const testCodes = [false, null, 'KEYBOARD'];

            Promise.all(testCodes.map((code) => {
                const msg = Object.assign({}, data, {
                    originatingCountry: code
                });

                return new Message(msg).save().reflect();
            })).each((inspection) => {
                const result = inspection.reason();

                expect(result).to.be.an('object');
                expect(result).to.have.nested.property('errors.originatingCountry.message');
                expect(result.errors.originatingCountry.message).to.be.oneOf([
                    Errors.general.requiredProperty('originatingCountry'),
                    Errors.Message.originatingCountry
                ]);
            }).then(() => {
                /**
                 * Then, verify good data will pass validation
                 */
                const validCountryCode = countries[Object.keys(countries)[100]].alpha2; // Random valid country code

                const msg = Object.assign({}, data, {
                    originatingCountry: validCountryCode
                });

                new Message(msg).save((err, message) => {
                    expect(err).to.be.null;
                    expect(message).to.be.an('object');
                    expect(message).to.have.property('_id');

                    done();
                });
            });
        });
    });

    // Prove the timePlaced plugin is working
    describe('timePlaced', () => {
        it('should be a date string with the format: DD-MMM-YY HH:mm:ss', (done) => {
            new Promise((resolve, reject) => {
                new Message(Object.assign({}, data, {
                    timePlaced: '56-JAN-15 70:27:44'
                })).save((error, message) => {
                    expect(error).be.an('object')
                        .that.has.nested.property('errors.timePlaced.message')
                        .that.equals(Errors.Message.timePlaced);

                    resolve();
                });
            })
            .then(() => {
                new Message(Object.assign({}, data, {
                    timePlaced: '01-OCT-20 23:27:02'
                })).save((error, message) => {
                    expect(error).be.null;
                    expect(message).to.be.an('object')
                        .that.has.property('userId', data.userId);

                    done();
                });
            });
        });
    });

    describe('Valid data', () => {
        it('should save successfully', (done) => {
            new Message(data).save((err, message) => {
                expect(err).to.be.null;
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