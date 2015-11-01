////////////////////////////////////////
//// -+- log codes -+- /////////////////
//// 200 success ///////////////////////
//// 400 invalid body //////////////////
//// 401 invalid secret or password ////
//// 403 invalid ip ////////////////////
//// 404 invalid resource //////////////
//// 409 invalid state /////////////////
//// 500 cannot read gpio //////////////
//// 501 cannot write gpio /////////////
////////////////////////////////////////

var moment  = require('moment');
var logRepo = require('../repositories/logRepository');

exports.console = function(log) {
	var string = log.HttpMethod + log.Uri + " from " + log.Url + " (" + log.DurationMillis + "ms) " + log.HttpCode + ": " + log.Message;
	console.log(string);
};

exports.error = function (message, code) {
  this.message = message;
  this.code = code;
};

exports.createHttpLog = function (res) {
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

exports.getHttpLogs = function (res) {
	return logRepo.getHttpLogs(res);
}

exports.formatHttpResults = function (result) {
	var headers = ["id", "url", "uri", "method", "code", "duration", "date", "time", "message"];
	var table = [];
	result.rows.forEach(function(r) {
		var datecreated = moment(r.datecreated).format('MMM D');
		var timecreated = moment(r.datecreated).format('h:m:s.SSS a');
		table.push({
			'id' : r.id,
			'url' : r.url,
			'uri' : r.uri,
			'method' : r.httpmethod,
			'code' : r.httpcode,
			'duration' : r.durationmillis,
			'date' : datecreated,
			'time' : timecreated,
			'message' : r.message
		});
	});
	return {
		headers: headers,
		table: table
	};
}