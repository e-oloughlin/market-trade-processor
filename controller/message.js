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
    }
};