var express = require('express');
var router = express.Router();

var bodyParse = require('body-parser')
var jsonParser = bodyParse.json()
var urlencoded = bodyParse.urlencoded({ extended: true })

var config = require('../config/site.json');

var captcha = require('express-recaptcha').RecaptchaV2;

var recaptcha = new captcha(config.grecaptcha.public_token, config.grecaptcha.private_token, {callback:'recaptcha_callback'});

var query_controller = require('../controllers/contentController')

router.use('/query', jsonParser)

router.use('/query', urlencoded)

router.post('/query', recaptcha.middleware.verify, query_controller.verify_captcha)

router.post('/query', query_controller.query_registration)

module.exports = router;