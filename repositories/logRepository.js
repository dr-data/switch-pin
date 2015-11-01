var escape = require("pg-escape");
var squel = require("squel");
var db = require('../config/db');
var logService = require('../services/logService');
var defaultLimit = 100;
var table = "HttpRequests";

exports.setHttpLog = function (log) {

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

  logService.console(log);
  db.insert(sql);
};

exports.getHttpLogs = function (res) {

  var sql = squel
    .select()
    .from(table)
    .field("Id")
    .field("Url")
    .field("Uri")
    .field("HttpMethod")
    .field("HttpCode")
    .field("DurationMillis")
    .field("DateCreated")
    .field("Message")
    .order("DateCreated", false)
    .limit(defaultLimit)
    .toString();

  db.select(sql, res);
};
