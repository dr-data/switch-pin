var moment     = require('moment');
var logRepo    = require('../repositories/logRepository');
var logService = require('../services/logService');

exports.response = function (res, callback) {
  try {
    res.message = "OK";
    res.json(callback()).status(200).end();
  } catch (e) {
    res.message = e.message || "server error";
    res.status(e.code || 500).end();
  } finally {
  	var log = logService.createHttpLog(res);
    logRepo.setHttpLog(log);
  }
};