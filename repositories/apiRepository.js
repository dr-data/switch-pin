var escape = require("pg-escape");
var squel = require("squel");
var db = require('../config/db');
var config = require('../config/config');
var table = "HttpRequests";

exports.insertHttpLog = function (log) {

  // should clean: Url, Uri, Message

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
