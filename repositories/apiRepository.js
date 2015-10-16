var squel = require("squel");
var db = require('../config/db');
var table = "HttpRequests";

exports.insertHttpLog = function (log) {

  var sql = squel
    .insert()
    .into(table)
    .set("Url", log.Url)
    .set("Uri", log.Uri)
    .set("Message", log.Message)
    .set("HttpMethod", log.HttpMethod)
    .set("HttpCode", log.HttpCode)
    .set("DurationMillis", log.DurationMillis)
    .toString();

  db.insert(sql);
};
