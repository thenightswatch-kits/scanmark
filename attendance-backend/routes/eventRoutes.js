const express = require('express')
const eventController = require('../controllers/eventController')
const { cookieJwtAuth } = require("../middlewares/cookieJwtAuth");
const router = express.Router()

router.route('/').post(cookieJwtAuth, eventController.createController)
router.route('/').get(eventController.getAllEventsController)
router.route('/toggle').post(cookieJwtAuth, eventController.toggleActiveController)


module.exports = router