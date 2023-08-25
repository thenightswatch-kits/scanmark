const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()
const { cookieJwtAuth } = require("../middlewares/cookieJwtAuth");

router.route('/login').post(authController.loginController)
router.route('/logout').post(authController.logoutController)
router.route('/register').post(authController.registerController)
router.route('/delete').post(cookieJwtAuth, authController.deleteUserController)
router.route('/').get(authController.getUsernamesController)


module.exports = router