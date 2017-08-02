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
                        expect(res.body).to.be.an('object').that.has.nested.property('message', 'Message updated');

                        expect(res.body).to.have.nested.property('object.userId', mockMessage.userId);
                        expect(res.body).to.have.nested.property('object.currencyTo', newCurrency);

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