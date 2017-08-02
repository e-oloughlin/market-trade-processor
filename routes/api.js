const express = require('express');
const router = express.Router({mergeParams: true});
const MessageController = require('../controller/message');

/**
 * REST API Route
 */
router.route('/message')
    .get(MessageController.GetMessages)
    .post(MessageController.CreateMessage)

router.route('/message/:id')
    .get(MessageController.GetMessage)
    .put(MessageController.UpdateMessage);

module.exports = router;