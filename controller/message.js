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
        Message.findById(req.params.id, (error, message) => {
            if(error) return res.json(error);

            res.json(message);
        });
    },
    /*
     * POST /api/message route to create a message
     */
    CreateMessage: (req, res) => {
        let message = new Message(req.body);

        message.save((error, message) => {
            if(error) return res.json(error);

            res.json({
                message: 'Message saved',
                object: message
            });
        });
    },
    /*
     * PUT /api/message route to update a message
     */
    UpdateMessage: (req, res) => {
        Message.findById(req.params.id, (error, message) => {
            if(error) return res.json(error);

            Object.assign(message, req.body).save((err, message) => {
                if(err) return res.json(err);

                res.json({
                    message: 'Message updated',
                    object: message
                });
            });
        });
    }
};