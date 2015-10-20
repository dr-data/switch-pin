var config = require('../config/config');
var pins   = require('../services/pinService');

exports.setPermissions = function (response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization', 'Content-Length');
};

exports.verifyPassword = function(password) {
  return (password == config.password) ? pins.getPins() : "";
};

exports.verifySecret = function(secret) {
  return (secret == config.secret) ? pins.getPins() : "";
};
