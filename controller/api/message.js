const _ = require('lodash');
const Errors = require('../../config/errors').get('model');
const Message = require('../../model/message');
const pubsub = require('pubsub-js');
const countryLocations = require('../../data/country-locations.json');

/**
 * Accepts a collection of mongoose models
 * and returns them transformed to an array
 * of plain objects
 * @param  {Array}
 * @return {Array}
 */
function jsonifyDocuments(documents) {
    return _.map(documents, (document) => {
        return document.toObject();
    });
}

/**
 * Adds child objects to a mongoose document
 * @param {Array|Object} message
 */
function addDepth(message) {
    let response;

    if(_.isArray(message)) {
        response = _.map(message, (msg) => {
            return _.assign({}, msg, {
                countryInfo: _.find(countryLocations, (country) => {
                    return country.code === msg.originatingCountry
                })
            });
        });
    }

    if(_.isPlainObject(message)) {
        let countryInfo = _.find(countryLocations, (country) => {
            return country.code === message.originatingCountry
        });

        response = _.assign({}, message, { countryInfo });
    }

    return response;
}

/**
 * There is a discrepancy between the countries found in npm module country-data
 * and the list found in data/country-locations.json
 * This causes issues with locating a country on a map so this function can check
 * to see of a message's originating country is located within data/country-locations.json
 * as that file contains the application's needed lat lon coordinates
 * @param  {Object} message
 * @return {Boolean}
 */
function checkWorkingCountry(message) {
    let check = _.find(countryLocations, (country) => {
        return country.code === message.originatingCountry
    });

    return !!check;
}

module.exports = {
    /*
     * GET /api/message route to retrieve all messages
     */
    GetMessages: (req, res) => {
        Message.find({}, (err, messages) => {
            if (err) return res.json(err);

            if(req.query.depth == 1) {
                return res.json(addDepth(jsonifyDocuments(messages)));
            }

            return res.json(messages);
        });
    },
    /*
     * GET /api/message/:id route to retrieve a single message
     */
    GetMessage: (req, res) => {
        Message.findById(req.params.id, (err, message) => {
            if(err) return res.json(err);

            if(req.query.depth == 1) {
                return res.json(addDepth(message.toObject()));
            }

            return res.json(message);
        });
    },
    /*
     * POST /api/message route to create a message
     */
    CreateMessage: (req, res) => {
        let message = new Message(req.body);

        message.validate((err) => {
            if(err) {
                let errors = {};

                _.forIn(err.errors, (value, key) => {
                    errors[key] = value.message;
                });

                return res.json({
                    status: 'Message save failed',
                    errors
                });
            }

            if(!checkWorkingCountry(req.body)) {
                return res.json({
                    status: 'Message save failed',
                    errors: {
                        originatingCountry: Errors.Message.badCountry,
                        countryCode: req.body.originatingCountry
                    }
                });
            }

            message.save((err, message) => {
                // Announce the creation of a new message object
                pubsub.publish('new-message', addDepth(message.toObject()));

                return res.json({
                    status: 'Message saved',
                    object: message
                });
            });
        });
    },
    /*
     * PUT /api/message route to update a message
     */
    UpdateMessage: (req, res) => {
        Message.findById(req.params.id, (err, message) => {
            if(err) return res.json(err);

            Object.assign(message, req.body).save((err, message) => {
                if(err) return res.json(err);

                return res.json({
                    status: 'Message updated',
                    object: message
                });
            });
        });
    },
    /*
     * DELETE /api/message route to delete a message
     */
    RemoveMessage: (req, res) => {
        Message.remove({_id: req.params.id}, (err, result) => {
            return res.json({
                status: 'Message deleted',
                result
            });
        });
    }
};