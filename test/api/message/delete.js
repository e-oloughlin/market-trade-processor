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
                            .that.has.property('message', 'Message deleted');

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