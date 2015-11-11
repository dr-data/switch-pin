var query      = require('pg-query');
var config     = require('./config');
var api        = require('../services/apiService');
var logService = require('../services/logService');
query.connectionParameters = config.dbConString;

exports.insert = function (sql) {
	query(sql, function(err, rows, result) {
		if (err) {
			console.log(err);
		}
	});
};

exports.select = function (sql, jsonCallback, res) {
	var result = query(sql, function(err, rows, result) {
		if (err) {
			console.log(err);
		}
		var json = jsonCallback(result);
		var responseCallback = (function() { return json; });
		api.response(res, responseCallback);
	});
};