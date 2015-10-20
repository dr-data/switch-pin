var express = require('express');
var router  = express.Router();
var config  = require('../config/config');
var pins    = require('../services/pinService');
var api     = require('../services/apiService');
var auth    = require('../services/authService');

router.route('/pins')
    .get(function(req,res){
        var callback = pins.getPins;
        api.response(res, callback);
     });

router.route('/pins/:id')
    .get(function(req,res){
        var callback = function(){ return pins.getPin(req.params.id) };
        api.response(res, callback);
    });

router.route('/:id')
    .put(function(req,res){
        console.log('switching ' + req.params.id + ' to ' + req.params.state);
        var callback = function(){ return pins.setPin(req.params.id, req.params.state) };
        api.response(res, callback);
    });
//    .options(function(req, res) {
//        auth.setPermissions(res);
//        var callback = function(){ return; };
//        api.response(res, callback);
//    });

module.exports = router;
