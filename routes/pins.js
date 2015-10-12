var express = require('express');
var router = express.Router();
var config = require('../auth/config');
var pins = require('../services/pinService');
var api = require('../services/apiService');

router.route('/pins')
    .get(function(req,res){
        try {
            json = pins.getPins();
            api.response(res, json);
        } catch (e) {
            api.failure(res, e);
        }
     });

router.route('/pins/:id')
    .get(function(req,res){
        try {
            json = pins.getPin(req.params.id);
            api.response(res,json);
        } catch (e) {
            api.failure(res, e);
        }
    });

router.route('/on/:id')
    .get(function(req,res){
        try {
            json = pins.setPin(req.params.id, 1);
            api.response(res,json);
        } catch (e) {
            api.failure(res, e);
        }
    });

router.route('/off/:id')
    .get(function(req,res){
        try {
            json = pins.setPin(req.params.id, 0);
            api.response(res,json);
        } catch (e) {
            api.failure(res, e);
        }
    });

module.exports = router;
