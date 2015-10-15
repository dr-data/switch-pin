var config = require('../auth/config');
var query = require('pg-query');
query.connectionParameters = config.dbConString;

exports.insertHttpLog = function (log) {
	// TODO: add URI to table!

	var values = [log.Url, log.HttpMethod, log.HttpCode, log.DurationMillis]
	var valuesString = "'" + log.Url +"','"+ log.HttpMethod +"',"+ log.HttpCode +","+ log.DurationMillis + ",'2011-05-17 10:40:28.876'";

	var sql = "INSERT INTO HttpRequests (Url, HttpMethod, HttpCode, DurationMillis, DateCreated) VALUES (" + valuesString + ")";
  
  console.log(sql);

  query(sql, function(err, rows, result) {
  	console.log('======rows======');
  	console.log(rows);
  	console.log('-----result-----');
  	console.log(result);
  	console.log('~~~~~~error~~~~~');
  	console.log(err);
  });

};
