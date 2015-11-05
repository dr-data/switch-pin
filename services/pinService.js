var log         = require('../services/logService');
var config      = require('../config/config');
var PythonShell = require('python-shell');
var api         = require('../services/apiService');
var options     = { mode: 'json',
                    pythonPath: config.pythonPath,
                    scriptPath: config.scriptPath };

exports.setPin = function (number, state, res) {
  options.args = ["write", number, state];
  executeShellScript(res);
};

exports.getPins = function (number, res) {
  options.args = ["read", number];
  executeShellScript(res);
};

function executeShellScript(res) {
  var shell = new PythonShell('switch.py', options);
  var json;
  shell.on('message', function (message) { json = message; });
  shell.end(function (err) {
    var callback = (json.pins.length > 0) ? successCallback(json) : failCallback();
    api.response(res, callback);
  });
}

function getLabelByNumber(number) {
  var label = "";
  config.pins.forEach(function(pin) {
    label = (pin.number == number) ? pin.label : label;
  });
  return label;
}

function successCallback(json) {
  for (var i=0; i<json.pins.length; i++) {
    json.pins[i].label = getLabelByNumber(json.pins[i].number);
  }
  return (function() { return json; });
}

function failCallback() {
  return (function() { throw new log.error("Failed to access GPIO", 500); });
}
