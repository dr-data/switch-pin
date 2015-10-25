exports.console = function(log) {
	var string = log.HttpMethod + log.Uri + " from " + log.Url + " (" + log.DurationMillis + "ms) " + log.HttpCode + ": " + log.Message;
	console.log(string);
};

exports.error = function (message, code) {
  this.message = message;
  this.code = code;
};

///////////////////////////////
//// log codes ////////////////
//// 200 success //////////////
//// 400 invalid body /////////
//// 401 invalid secret ///////
//// 402 invalid password /////
//// 403 invalid ip ///////////
//// 404 invalid resource /////
//// 409 invalid state ////////
//// 500 cannot read gpio /////
//// 501 cannot write gpio ////
///////////////////////////////