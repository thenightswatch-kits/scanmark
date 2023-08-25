const express = require('express')
const { cookieJwtAuth } = require("../middlewares/cookieJwtAuth");
const attendenceController = require('../controllers/attendenceController')
const router = express.Router()

router.route('/').post(cookieJwtAuth,attendenceController.markController)
router.route('/').get(attendenceController.getAttendanceController)



module.exports = router