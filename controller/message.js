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
    }
};