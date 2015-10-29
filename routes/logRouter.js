var express = require('express');
var router  = express.Router();
var api     = require('../services/apiService');

router.route('/')
    .get(function(req,res){

        var callback = function () {
            return {'log':'suckaz!'};
        };
        api.response(res, callback);
        
     });

module.exports = router;
