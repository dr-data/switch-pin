var express = require('express');
var router = express.Router();
var config = require('../auth/config');
var pins = require('../services/pinService');

router.route('/pins')
    .get(function(req,res){
        var callback = pins.getPins;
        createResponse(res, callback);
     });

router.route('/pins/:id')
    .get(function(req,res){
        var callback = function(){ return pins.getPin(req.params.id) };
        createResponse(res, callback);
    });

router.route('/on/:id')
    .get(function(req,res){
        var callback = function(){ return pins.setPin(req.params.id, 1) };
        createResponse(res, callback);
    });

router.route('/off/:id')
    .get(function(req,res){
        var callback = function(){ return pins.setPin(req.params.id, 0) };
        createResponse(res, callback);
    });

function createResponse(res, callback) {
  try {
    res.json(callback()).status(200).end();
  } catch (e) {
    console.log(e.message);
    res.status(e.code).end();  
  }
}

module.exports = router;
