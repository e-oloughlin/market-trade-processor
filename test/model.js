const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const Message = require('../model/message');

let data = {
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
            const msg = Object.assign({}, data, {
                userId: 'fifty six',
            });

            let message = new Message(msg);

            message.save((err, message) => {
                expect(err).to.be.an('object');

                done();
            });
        });
    });

    describe('currencyFrom', () => {
        it('should be a valid currency code', (done) => {
            const msg = Object.assign({}, data, {
                currencyFrom: 'some string that is not a currency code',
            });

            let message = new Message(msg);

            message.save((err, message) => {
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

            let message = new Message(msg);

            message.save((err, message) => {
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

            let message = new Message(msg);

            message.save((err, message) => {
                expect(err).to.be.an('object');
                expect(err.errors).to.have.property('amountSell');

                done();
            });
        });
    });

    describe('Valid data', () => {
        it('should save successfully', (done) => {
            let message = new Message(data);

            message.save((err, message) => {
                expect(message).to.be.an('object');

                done();
            });
        });
    });

    after((done) => {
        mongoose.disconnect();

        done();
    });

});