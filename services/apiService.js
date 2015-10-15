var moment = require('moment');
var apiRepo = require('../repositories/apiRepository');

exports.response = function (res, callback) {
  try {
    res.json(callback()).status(200).end();
  } catch (e) {
    // TODO: errors should be logged too
    console.log(e.message);
    res.status(e.code).end();
  } finally {
    apiRepo.insertHttpLog(createHttpLog(res));
  }
};

function createHttpLog(res) {
    var durationMillis = moment().valueOf() - res.startTime.valueOf();
    return {
                Url: res.req.ip,
                Uri: res.req.originalUrl,
                HttpMethod: res.req.method,
                HttpCode: res.statusCode,
                DurationMillis: durationMillis
              }
}
