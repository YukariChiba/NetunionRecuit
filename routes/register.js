var express = require('express');
var router = express.Router();

var bodyParse = require('body-parser')
var jsonParser = bodyParse.json()
var urlencoded = bodyParse.urlencoded({ extended: true })

var config = require('../config/site.json');

var captcha = require('express-recaptcha').RecaptchaV2;

var recaptcha = new captcha(config.grecaptcha.public_token, config.grecaptcha.private_token, {callback:'recaptcha_callback'});

var register_controller = require('../controllers/contentController')

router.use('/register', jsonParser)

router.use('/register', urlencoded)

router.post('/register', recaptcha.middleware.verify, register_controller.verify_captcha)

router.post('/register', register_controller.do_registration)

module.exports = router;