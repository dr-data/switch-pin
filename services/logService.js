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
	var string;
	if (log.HttpCode) {
		string = log.HttpMethod + log.Uri + " from " + log.Url + " (" + log.DurationMillis + "ms) " + log.HttpCode + ": " + log.Message;
	} else if (log.Gpio) {
		string = "GPIO/" + log.Gpio + "/" + log.RequestState.substring(2,3) + " (" + log.StartState.substring(2,3) + " -> " + log.EndState.substring(2,3) + ")";
	} else {
		string = "no log found";
		console.log(log);
	}
	console.log(string);
};

exports.error = function (message, code) {
  this.message = message || "no message found";
  this.code = code || "no code found";
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
            };
};

exports.createSwitchLog = function(switched) {
	return {
		FitbitRequestId: null,
		HttpRequestId: null,
		Gpio: parseInt(switched.gpio),
		RequestState: "B'" + parseInt(switched.requeststate) + "'",
		StartState: "B'" + switched.startstate + "'",
		EndState: "B'" + switched.endstate + "'"
	};
};

exports.getHttpLogs = function (res) {
	return logRepo.getHttpLogs(res);
};

exports.getSwitchLogs = function (res) {
	return logRepo.getSwitchLogs(res);
};

exports.formatSwitchResults = function (result) {
	var headers = ["id", "fitbitrequestid", "httprequestid", "gpio", "requeststate", "startstate", "endstate", "datecreated"];
	var table = [];
	result.rows.forEach(function(r) {
		var datecreated = moment(r.datecreated).format('MMM D');
		var timecreated = moment(r.datecreated).format('h:m:s.SSS a');
		table.push({
			'id' : r.id,
			'fitbitrequestid' : r.fitbitrequestid,
			'httprequestid' : r.httprequestid,
			'gpio' : r.gpio,
			'requeststate' : r.requeststate,
			'startstate' : r.startstate,
			'endstate' : r.endstate,
			'date' : datecreated,
			'time' : timecreated
		});
	});
	return {
		headers: headers,
		table: table
	};
};

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
};