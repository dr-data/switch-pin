var moment = require('moment');
var apiRepo = require('../repositories/apiRepository');

exports.response = function (res, callback) {
  try {
    res.message = "OK";
    res.json(callback()).status(200).end();
  } catch (e) {
    res.message = e.message || "server error";
    res.status(e.code || 500).end();
  } finally {
    apiRepo.insertHttpLog(createHttpLog(res));
  }
};

function createHttpLog(res) {
    var durationMillis = moment().valueOf() - res.startTime.valueOf();
    return {
                Url: res.req.ip,
                Uri: res.req.originalUrl,
                Message: res.message,
                HttpMethod: res.req.method,
                HttpCode: res.statusCode,
                DurationMillis: durationMillis
              }
}
