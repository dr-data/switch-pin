var query = require('pg-query');
var config = require('./config');
query.connectionParameters = config.dbConString;

exports.insert = function (sql) {
	query(sql, function(err, rows, result) {
		if (err) console.log(err);
	});
};