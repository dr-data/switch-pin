exports.console = function(log) {
	var string = log.HttpMethod + log.Uri + " from " + log.Url + " (" + log.DurationMillis + "ms) - " + log.HttpCode + ":" + log.Message;
	console.log(string);
};

exports.error = function (message, code) {
  this.message = message;
  this.code = code;
};
