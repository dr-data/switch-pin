var escape = require("pg-escape");
var squel = require("squel");
var db = require('../config/db');
var logService = require('../services/logService');
var defaultLimit = 100;
var httpTable = "HttpRequests";
var switchTable = "SwitchRequests";

exports.setHttpLog = function (log) {

  // should clean: Url, Uri, Message

  var sql = squel
    .insert()
    .into(httpTable)
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
    .from(httpTable)
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

  var jsonCallback = (function(result) { return logService.formatHttpResults(result) });
  db.select(sql, jsonCallback, res);
};

exports.setSwitchLog = function (log) {

  var sql = squel
    .insert()
    .into(switchTable)
    .set("FitbitRequestId", log.FitbitRequestId)
    .set("HttpRequestId", log.HttpRequestId)
    .set("Gpio", log.Gpio)
    .set("RequestState", log.RequestState, { dontQuote: true })
    .set("StartState", log.StartState, { dontQuote: true })
    .set("EndState", log.EndState, { dontQuote: true })
    .toString();

  logService.console(log);
  db.insert(sql);
};

exports.getSwitchLogs = function (res) {

  var sql = squel
    .select()
    .from(switchTable)
    .field("Id")
    .field("FitbitRequestId")
    .field("HttpRequestId")
    .field("Gpio")
    .field("RequestState")
    .field("StartState")
    .field("EndState")
    .field("DateCreated")
    .order("DateCreated", false)
    .limit(defaultLimit)
    .toString();

  var jsonCallback = (function(result) { return logService.formatSwitchResults(result) });
  db.select(sql, jsonCallback, res);
};