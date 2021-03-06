const config = require('../../../config/app').get(process.env.NODE_ENV);
const mongoose = require('mongoose');
const Promise = require('bluebird');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const Errors = require('../../../config/errors').get('model');
const Message = require('../../../model/message');
const app = require('../../../app').app;

chai.use(chaiHttp);

// Use bluebird for mongoose promises
mongoose.Promise = Promise;

// A sample plain message object
const mockMessage = require('../../../mock/data').message;

/**
 * REST API Tests
 */
describe('REST API', () => {
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
     * GET /api/message
     */
    describe('GET /api/message', () => {
        /**
         * Create 2 new DB entries
         */
        const rates = [0.898, 0.924];

        before((done) => {
            Promise.all(rates.map((rate) => {
                const data = Object.assign({}, mockMessage, { rate });

                return chai.request(app).post('/api/message').send(data);
            }))
            .then(done());
        });

        it('should return all messages', (done) => {
            /**
             * Then, verify they are returned from the API
             */
            chai.request(app).get('/api/message')
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200);
                    expect(response).to.have.headers;

                    expect(response.body).to.be.an('array');
                    expect(response.body).to.have.lengthOf(2);
                    expect(response.body[0]).to.have.property('rate').that.is.oneOf(rates);
                    expect(response.body[1]).to.have.property('rate').that.is.oneOf(rates);

                    expect(response.body[0]).to.not.have.property('countryInfo');
                    expect(response.body[1]).to.not.have.property('countryInfo');

                    done();
                });
        });

        it('should return all messages with country info when depth=1', (done) => {
            /**
             * Then, verify they are returned from the API
             */
            chai.request(app).get('/api/message?depth=1')
                .end((error, response) => {
                    expect(error).to.be.null;
                    expect(response).to.have.status(200);
                    expect(response).to.have.headers;

                    expect(response.body).to.be.an('array');
                    expect(response.body).to.have.lengthOf(2);

                    expect(response.body[0]).to.have.property('rate').that.is.oneOf(rates);
                    expect(response.body[1]).to.have.property('rate').that.is.oneOf(rates);

                    expect(response.body[0]).to.have.nested.property('countryInfo.latitude');
                    expect(response.body[1]).to.have.nested.property('countryInfo.longitude');
                    expect(response.body[1]).to.have.nested.property('countryInfo.name');

                    done();
                });
        });
    });

    /**
     * GET /api/message/:id
     */
    describe('GET /api/message/:id', () => {
        let messageId;

        /**
         * Create a new DB entry
         */
        before((done) => {
            const data = Object.assign({}, mockMessage);

            new Message(data).save((error, message) => {
                if(error) throw error;

                messageId = message._id;

                done();
            });
        });

        /**
         * Then, verify it can be returned from the API
         */
        it('should return a message by its id property', (done) => {
            chai.request(app)
            .get('/api/message/'+messageId)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.have.headers;

                expect(response.body).to.be.an('object');
                expect(response.body).to.include(mockMessage);

                done();
            });
        });

        it('should return a message by its id property with country info when depth=1', (done) => {
            chai.request(app)
            .get('/api/message/'+messageId+'?depth=1')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.have.headers;

                expect(response.body).to.be.an('object');
                expect(response.body).to.include(mockMessage);

                expect(response.body).to.have.nested.property('countryInfo.latitude');
                expect(response.body).to.have.nested.property('countryInfo.longitude');
                expect(response.body).to.have.nested.property('countryInfo.name');

                done();
            });
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
                let data = Object.assign({}, mockMessage, {
                    userId
                });

                return chai.request(app).post('/api/message').send(data);
            }))
            .each((response) => {
                expect(response).to.have.status(200);
                expect(response).to.have.headers;

                expect(response).to.be.an('object').that.has.property('body');
                expect(response.body).to.be.an('object')
                    .that.has.property('status', 'Message save failed');

                expect(response.body)
                    .to.have.nested.property('errors.userId')
                    .that.is.oneOf([
                        Errors.Message.userId,
                        Errors.general.requiredProperty('userId'),
                        Errors.general.typeCast('Number', 'fifty six', 'userId')
                    ]);
            })
            .then(function fulfilled(result) {
                done();
            });
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
                expect(response.body).to.be.an('object')
                    .that.has.property('status', 'Message save failed');

                expect(response.body)
                    .to.have.nested.property('errors.currencyFrom')
                    .that.equals(Errors.Message.currencyFrom);
            })
            .then(function fulfilled(result) {
                done();
            });
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
                expect(response.body).to.be.an('object')
                    .that.has.property('status', 'Message save failed');

                expect(response.body)
                    .to.have.nested.property('errors.currencyTo')
                    .that.equals(Errors.Message.currencyTo);
            })
            .then(function fulfilled(result) {
                done();
            });
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
                expect(response.body).to.be.an('object')
                    .that.has.property('status', 'Message save failed');

                expect(response.body)
                    .to.have.nested.property('errors.amountSell')
                    .that.is.oneOf([
                        Errors.Message.amountSell,
                        Errors.general.requiredProperty('amountSell'),
                        Errors.general.typeCast('Number', 'twenty six', 'amountSell')
                    ]);
            })
            .then(function fulfilled(result) {
                done();
            });
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
                expect(response.body).to.be.an('object')
                    .that.has.property('status', 'Message save failed');

                expect(response.body)
                    .to.have.nested.property('errors.amountBuy')
                    .that.is.oneOf([
                        Errors.Message.amountBuy,
                        Errors.general.requiredProperty('amountBuy'),
                        Errors.general.typeCast('Number', 'fourty two', 'amountBuy')
                    ]);
            })
            .then(function fulfilled(result) {
                done();
            });
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
                expect(response.body).to.be.an('object')
                    .that.has.property('status', 'Message save failed');

                expect(response.body)
                    .to.have.nested.property('errors.rate')
                    .that.is.oneOf([
                        Errors.Message.rate,
                        Errors.general.requiredProperty('rate'),
                        Errors.general.typeCast('Number', 'ten', 'rate')
                    ]);
            })
            .then(function fulfilled(result) {
                done();
            });
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
                expect(response.body).to.be.an('object')
                    .that.has.property('status', 'Message save failed');

                expect(response.body)
                    .to.have.nested.property('errors.originatingCountry')
                    .that.is.oneOf([
                        Errors.Message.originatingCountry,
                        Errors.general.requiredProperty('originatingCountry')
                    ]);
            })
            .then(done());
        });

        /**
         *  originatingCountry should be a country within data/country-locations.json
         *  This is merely to assure the front end won't fail with incomplete data later.
         *  This is obviously not ideal but this is a sample app :)
         */
        it('should reject a bad originatingCountry', (done) => {
            let data = Object.assign({}, mockMessage, {
                originatingCountry: 'SX' // SX is not in data/country-locations.json
            });

            chai.request(app).post('/api/message').send(data).end((error, response) => {
                expect(error).to.be.null;

                expect(response).to.be.an('object')
                    .that.has.nested.property('body.status')
                    .that.equals('Message save failed');

                expect(response.body)
                    .to.have.nested.property('errors.originatingCountry')
                    .that.equals(Errors.Message.badCountry);

                expect(response.body)
                    .to.have.nested.property('errors.countryCode')
                    .that.equals('SX');

                done();
            });
        });

        /**
         *  Valid Data
         */
        it('should accept a valid object', (done) => {
            let data = Object.assign({}, mockMessage);

            chai.request(app).post('/api/message').send(data).end((error, response) => {
                expect(error).to.be.null;

                expect(response).to.be.an('object')
                    .that.has.nested.property('body.status')
                    .that.equals('Message saved');

                expect(response.body).to.have.nested.property('object.userId')
                    .that.equals(data.userId);

                done();
            });
        });
    });

    describe('PUT /api/message/:id', () => {
        let messageId;
        let newCurrency = 'AUD';
        /**
         * Create a new DB entry
         */
        before((done) => {
            const data = Object.assign({}, mockMessage);

            new Message(data).save((error, message) => {
                if(error) throw error;

                messageId = message._id;

                done();
            });
        });

        it('should update a message successfully', (done) => {
            new Promise((resolve, reject) => {
                chai.request(app)
                    .put('/api/message/'+messageId)
                    .send({currencyTo: 'LOL'})
                    .end((error, res) => {
                        expect(error).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res).to.have.headers;

                        expect(res.body).to.be.an('object')
                            .that.has.nested.property('errors.currencyTo.message')
                                .that.equals(Errors.Message.currencyTo);

                        resolve();
                    });
            }).then(() => {
                chai.request(app)
                    .put('/api/message/'+messageId)
                    .send({currencyTo: newCurrency})
                    .end((error, res) => {
                        expect(error).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res).to.have.headers;
                        expect(res.body).to.be.an('object').that.has.nested.property('status', 'Message updated');

                        expect(res.body).to.have.nested.property('object.userId', mockMessage.userId);
                        expect(res.body).to.have.nested.property('object.currencyTo', newCurrency);

                        done();
                    });
            });
        });
    });

    describe('DELETE /api/message/:id', () => {
        let messageId;

        /**
         * Add a new todo item to the database before testing it
         */
        before((done) => {
            let message = new Message(mockMessage);

            // Add a new entry
            message.save((err, message) => {
                if(err) throw err;

                messageId = message._id;

                done();
            });
        });

        it('should delete a message successfully', (done) => {
            new Promise((resolve, reject) => {
                chai.request(app)
                    .delete('/api/message/'+messageId)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res).to.have.headers;
                        expect(res.body).to.be.an('object')
                            .that.has.property('status', 'Message deleted');

                        expect(res.body).to.have.nested.property('result.ok', 1);

                        resolve();
                    });
            }).then(() => {
                chai.request(app)
                    .get('/api/message/'+messageId)
                    .end((error, response) => {
                        expect(error).to.be.null;
                        expect(response).to.have.status(200);
                        expect(response).to.have.headers;
                        expect(response.body).to.be.null;

                        done();
                    });
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