var express    = require('express');
var router     = express.Router();
var api        = require('../services/apiService');
var logService = require('../services/logService');

router.route('/logs/:id')
    .get(function(req,res){
    	switch(req.params.id) {
    		case "HttpRequests":
    			logService.getHttpLogs(res);
    			break;
    		case "SwitchRequests":
    			logService.getSwitchLogs(res);
    			break;
    	}    	
     });

module.exports = router;
