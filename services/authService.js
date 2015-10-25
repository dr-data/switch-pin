var config = require('../config/config');
var log    = require('../services/logService');

exports.verifySecret = function(secret) {
  if (secret != config.secret) {
  	throw new log.error("Invalid secret", 401);
  }
  return {};
};

exports.verifyPassword = function(password) {
  if (password != config.password) {
    throw new log.error("Invalid password", 402);
  }
  return {};
};

exports.authorize = function(ip, body) {
  if (config.domains.indexOf(ip) < 0) {
    throw new log.error("Invalid IP", 403);
  }
  if (body.secret == null || body.state == null) {
    throw new log.error("Invalid body", 400);
  }
  if (body.secret != config.secret) {
    throw new log.error("Invalid secret", 401);
  }
  if (body.state != 0 && body.state != 1) {
    throw new log.error("Invalid state", 409);
  }
  return {};
};
