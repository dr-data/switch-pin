var express = require('express');
var router = express.Router();
var config = require('../config/config');
var pins = require('../services/pinService');
var api = require('../services/apiService');

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

router.route('/on/:id')
    .get(function(req,res){
        var callback = function(){ return pins.setPin(req.params.id, 1) };
        api.response(res, callback);
    });

router.route('/off/:id')
    .get(function(req,res){
        var callback = function(){ return pins.setPin(req.params.id, 0) };
        api.response(res, callback);
    });

module.exports = router;
