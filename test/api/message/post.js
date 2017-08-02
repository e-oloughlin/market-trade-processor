const config = require('../../../config/app').get(process.env.NODE_ENV);
const mongoose = require('mongoose');
const Promise = require('bluebird');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const Errors = require('../../../config/errors').get('model');
const Message = require('../../../model/message');
const app = require('../../../app');

chai.use(chaiHttp);

// Use bluebird for mongoose promises
mongoose.Promise = Promise;

// A sample plain message object
const mockMessage = require('../../../mock/data').message;

/**
 * REST API Tests
 */
describe('', () => {
    /**
     * Set up DB connection
     */
    before((done) => {
        mongoose.connect(config.database, {
            useMongoClient: true
        });

        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

        // Clear the database before testing
        mongoose.connection.once('open', () => {
            Message.remove({}).then(done());
        });
    });

    /**
     * POST /api/message
     */
    describe('POST /api/message', () => {
        /**
         *  userId
         */
        it('should reject an invalid userId', (done) => {
            let testIds = [false, 'fifty six', null, 78.456];

            Promise.all(testIds.map((userId) => {
                let data = Object.assign({}, mockMessage, { userId });

                return chai.request(app).post('/api/message').send(data);
            }))
            .each((response) => {
                expect(response).to.have.status(200);
                expect(response).to.have.headers;
                expect(response).to.be.an('object').that.has.property('body');
                expect(response.body).to.have.nested.property('errors.userId.message');

                expect(response.body.errors.userId.message)
                    .to.be.oneOf([
                        Errors.Message.userId,
                        Errors.general.requiredProperty('userId'),
                        Errors.general.typeCast('Number', 'fifty six', 'userId')
                    ]);
            })
            .then(done());
        });

        /**
         *  currencyFrom
         */
        it('should reject an invalid currencyFrom', (done) => {
            let testCurrencies = [45, false, 'some string that is not a currency code'];

            Promise.all(testCurrencies.map((currencyFrom) => {
                let data = Object.assign({}, mockMessage, { currencyFrom });

                return chai.request(app).post('/api/message').send(data);
            }))
            .each((response) => {
                expect(response).to.have.status(200);
                expect(response).to.have.headers;
                expect(response).to.be.an('object').that.has.property('body');
                expect(response.body).to.have.nested.property('errors.currencyFrom.message')
                    .that.equals(Errors.Message.currencyFrom);
            })
            .then(done());
        });

        /**
         *  currencyTo
         */
        it('should reject an invalid currencyTo', (done) => {
            let testCurrencies = [45, false, 'somestringthatisnotacurrencycode'];

            Promise.all(testCurrencies.map((currencyTo) => {
                let data = Object.assign({}, mockMessage, { currencyTo });

                return chai.request(app).post('/api/message').send(data);
            }))
            .each((response) => {
                expect(response).to.have.status(200);
                expect(response).to.have.headers;
                expect(response).to.be.an('object').that.has.property('body');
                expect(response.body).to.have.nested.property('errors.currencyTo.message')
                    .that.equals(Errors.Message.currencyTo);
            })
            .then(done());
        });

        /**
         *  amountSell
         */
        it('should reject an invalid amountSell', (done) => {
            let testAmounts = [false, null, 'twenty six'];

            Promise.all(testAmounts.map((amountSell) => {
                let data = Object.assign({}, mockMessage, { amountSell });

                return chai.request(app).post('/api/message').send(data);
            }))
            .each((response) => {
                expect(response).to.have.status(200);
                expect(response).to.have.headers;
                expect(response).to.be.an('object').that.has.property('body');
                expect(response.body).to.have.nested.property('errors.amountSell.message')
                    .that.is.oneOf([
                        Errors.Message.amountSell,
                        Errors.general.requiredProperty('amountSell'),
                        Errors.general.typeCast('Number', 'twenty six', 'amountSell')
                    ]);
            })
            .then(done());
        });

        /**
         *  amountBuy
         */
        it('should reject an invalid amountBuy', (done) => {
            let testAmounts = [false, null, 'fourty two'];

            Promise.all(testAmounts.map((amountBuy) => {
                let data = Object.assign({}, mockMessage, { amountBuy });

                return chai.request(app).post('/api/message').send(data);
            }))
            .each((response) => {
                expect(response).to.have.status(200);
                expect(response).to.have.headers;
                expect(response).to.be.an('object').that.has.property('body');
                expect(response.body).to.have.nested.property('errors.amountBuy.message')
                    .that.is.oneOf([
                        Errors.Message.amountBuy,
                        Errors.general.requiredProperty('amountBuy'),
                        Errors.general.typeCast('Number', 'fourty two', 'amountBuy')
                    ]);
            })
            .then(done());
        });

        /**
         *  rate
         */
        it('should reject an invalid rate', (done) => {
            let testRates = [false, null, 'ten'];

            Promise.all(testRates.map((rate) => {
                let data = Object.assign({}, mockMessage, { rate });

                return chai.request(app).post('/api/message').send(data);
            }))
            .each((response) => {
                expect(response).to.have.status(200);
                expect(response).to.have.headers;
                expect(response).to.be.an('object').that.has.property('body');
                expect(response.body).to.have.nested.property('errors.rate.message')
                    .that.is.oneOf([
                        Errors.Message.rate,
                        Errors.general.requiredProperty('rate'),
                        Errors.general.typeCast('Number', 'ten', 'rate')
                    ]);
            })
            .then(done());
        });

        /**
         *  originatingCountry
         */
        it('should reject an invalid originatingCountry', (done) => {
            let testCodes = [false, null, 'KEYBOARD'];

            Promise.all(testCodes.map((originatingCountry) => {
                let data = Object.assign({}, mockMessage, { originatingCountry });

                return chai.request(app).post('/api/message').send(data);
            }))
            .each((response) => {
                expect(response).to.have.status(200);
                expect(response).to.have.headers;
                expect(response).to.be.an('object').that.has.property('body');
                expect(response.body).to.have.nested.property('errors.originatingCountry.message')
                    .that.is.oneOf([
                        Errors.Message.originatingCountry,
                        Errors.general.requiredProperty('originatingCountry')
                    ]);
            })
            .then(done());
        });

        /**
         *  Valid Data
         */
        it('should accept an valid object', (done) => {
            let data = Object.assign({}, mockMessage);

            chai.request(app).post('/api/message').send(data).end((error, response) => {
                expect(error).to.be.null;

                expect(response).to.be.an('object')
                    .that.has.nested.property('body.message')
                    .that.equals('Message saved');

                expect(response.body).to.have.nested.property('object.userId')
                    .that.equals(data.userId);

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