var log = require('../services/logService');
var Gpio   = require('onoff').Gpio;

exports.getState = function (number) {
  var gpio = new Gpio(number, 'out');
  var state = gpio.readSync();
  gpio.unexport();
  if ([0,1].indexOf(state) < 0) {
    throw new log.error("GPIO " + number + " could not be read", 500);
  }
  return state;
};

exports.setState = function (number, state) {
  state = (state == 1) ? 1 : 0;
  var gpio = new Gpio(number, 'out');
  gpio.writeSync(state);
  gpio.unexport();
};
