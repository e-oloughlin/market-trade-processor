const _ = require('lodash');
const Message = require('../model/message');

module.exports = {
    /*
     * GET /api/message route to retrieve all messages
     */
    GetMessages: (req, res) => {
        Message.find({}, (err, messages) => {
            if (err) return res.json(err);

            res.json(messages);
        });
    },
    /*
     * GET /api/message/:id route to retrieve a single message
     */
    GetMessage: (req, res) => {
        Message.findById(req.params.id, (err, message) => {
            if(err) return res.json(err);

            res.json(message);
        });
    },
    /*
     * POST /api/message route to create a message
     */
    CreateMessage: (req, res) => {
        let message = new Message(req.body);

        message.save((err, message) => {
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

            res.json({
                status: 'Message saved',
                object: message
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

                res.json({
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
            res.json({
                status: 'Message deleted',
                result
            });
        });
    }
};