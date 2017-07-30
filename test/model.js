const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const Promise = require('bluebird');
const Message = require('../model/message');

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

describe('Model', () => {

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
            const ids = ['fifty six', null];

            Promise.all(ids.map((userId) => {
                const msg = Object.assign({}, data, { userId });

                return new Message(msg).save().reflect();
            })).each((inspection) => {
                const result = inspection.reason();

                expect(result).to.be.an('object');
                expect(result).to.have.property('errors');

            }).then(done());
        });
    });

    describe('currencyFrom', () => {
        it('should be a valid currency code', (done) => {
            const msg = Object.assign({}, data, {
                currencyFrom: 'some string that is not a currency code',
            });

            new Message(msg).save((err, message) => {
                expect(err).to.be.an('object');
                expect(err.errors).to.have.property('currencyFrom');
                expect(err.errors.currencyFrom.message).to.equal('currencyFrom must be a valid currency code');

                done();
            });
        });
    });

    describe('currencyTo', () => {
        it('should be a valid currency code', (done) => {
            const msg = Object.assign({}, data, {
                currencyTo: 'somestringthatisnotacurrencycode',
            });

            new Message(msg).save((err, message) => {
                expect(err).to.be.an('object');
                expect(err.errors).to.have.property('currencyTo');
                expect(err.errors.currencyTo.message).to.equal('currencyTo must be a valid currency code');

                done();
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