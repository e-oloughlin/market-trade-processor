const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const Promise = require('bluebird');
const Country = require('../../../model/country');
const config = require('../../../config/app').get(process.env.NODE_ENV);
const Errors = require('../../../config/errors').get('model');

// Set bluebird as mongoose's promise utility
mongoose.Promise = Promise;

// A valid country object
let data = {
    code: 'IE',
    latitude: 53.41291,
    longitude: -8.24389,
    name: 'Ireland'
};

describe('Model - Country', () => {
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

    describe('latitude', () => {
        it('should be a valid coordinate', (done) => {
            new Promise((resolve, reject) => {
                new Country(Object.assign({}, data, {
                    latitude: 'a string'
                })).save((error, country) => {
                    expect(error).be.an('object')
                        .that.has.nested.property('errors.latitude.message')
                        .that.equals(Errors.general.typeCast('Number', 'a string', 'latitude'));

                    resolve();
                });
            })
            .then(() => {
                new Country(Object.assign({}, data, {
                    latitude: 2.1
                })).save((error, country) => {
                    expect(error).to.be.null;

                    expect(country).be.an('object');

                    done();
                });
            });
        });
    });

    describe('longitude', () => {
        it('should be a valid coordinate', (done) => {
            new Promise((resolve, reject) => {
                new Country(Object.assign({}, data, {
                    longitude: 'another string'
                })).save((error, country) => {
                    expect(error).be.an('object')
                        .that.has.nested.property('errors.longitude.message')
                        .that.equals(Errors.general.typeCast('Number', 'another string', 'longitude'));

                    resolve();
                });
            })
            .then(() => {
                new Country(Object.assign({}, data, {
                    longitude: 1.56
                })).save((error, country) => {
                    expect(error).to.be.null;

                    expect(country).be.an('object');

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