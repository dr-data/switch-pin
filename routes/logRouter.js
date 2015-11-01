var express    = require('express');
var router     = express.Router();
var api        = require('../services/apiService');
var logService = require('../services/logService');

router.route('/log')
    .get(function(req,res){
    	logService.getHttpLogs(res);
     });

module.exports = router;
