const config = require('../config/app').get(process.env.NODE_ENV);
const mongoose = require('mongoose');
const Promise = require('bluebird');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const Message = require('../model/message');
const app = require('../app');

chai.use(chaiHttp);

// Use bluebird for mongoose promises
mongoose.Promise = Promise;

// A sample plain message object
const mockMessage = require('../mock/data').message;

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

                return new Message(data).save().reflect();
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