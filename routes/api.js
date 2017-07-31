const express = require('express');
const router = express.Router({mergeParams: true});
const MessageController = require('../controller/message');

/**
 * REST API Route
 */
router.route('/message')
    .get(MessageController.GetMessages);

module.exports = router;