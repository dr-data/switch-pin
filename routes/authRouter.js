var express = require('express');
var router  = express.Router();
var config  = require('../config/config');
var api     = require('../services/apiService');
var auth    = require('../services/authService');

router.route('/secret')
    .put(function(req, res, next) {
        var callback = function(){ return auth.verifySecret(req.body.secret); };
        api.response(res, callback);
    });

router.route('/password')
    .put(function(req, res, next) {
        var callback = function(){ return auth.verifyPassword(req.body.password); };
        api.response(res, callback);
    });

router.allowCrossDomain = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization', 'Content-Length');
    next();
}

module.exports = router;
