var express = require('express');
var router  = express.Router();
var pins    = require('../services/pinService');
var auth    = require('../services/authService');

router.route('/pins')
    .get(function(req,res){
        pins.getPins("all", res);
     });

router.route('/pins/:id')
    .get(function(req,res){
        pins.getPins(req.params.id, res);
    })
    .put(function(req,res){
        auth.authorize(req.ip, req.body);
        pins.setPin(req.params.id, req.body.state, res);
    });

module.exports = router;
