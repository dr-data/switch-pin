var express = require('express');
var router  = express.Router();
var config  = require('../config/config');
var api     = require('../services/apiService');
var auth    = require('../services/authService');

router.route('/secret*')
    .put(function(req, res, next) {
        console.log('secret: ' + req.body.secret);
        var callback = function(){ return auth.verifySecret(req.body.secret); };
        api.response(res, callback);
    })
    .options(function(req, res) {
        auth.setPermissions(res);
        var callback = function(){ return; };
        api.response(res, callback);
    });

router.route('/password*')
    .put(function(req, res, next) {
        console.log('password: ' + req.body.password);
        var callback = function(){ return auth.verifyPassword(req.body.password); };
        api.response(res, callback);
    })
    .options(function(req, res) {
        auth.setPermissions(res);
        var callback = function(){ return; };
        api.response(res, callback);
    });

module.exports = router;
