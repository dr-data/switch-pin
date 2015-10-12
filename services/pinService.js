var Gpio   = require('onoff').Gpio;
var config = require('../auth/config');

exports.setPin = function (number, state) {
  getPinByNumber(number);
  setState(number, state);
  return getPinJson(getPinByNumber(number));
};

exports.getPin = function (number) {
  return getPinJson(getPinByNumber(number));
};

exports.getPins = function () {
  var availablePins = [];
  config.pins.forEach(function(pin) {
    json = getPinJson(pin);
    availablePins.push(json);
  });
  return availablePins;
};

function getState(number) {
  var gpio = new Gpio(number, 'out');
  var state = gpio.readSync();
  gpio.unexport();
  if ([0,1].indexOf(state) < 0) {
    throw new config.error("GPIO pin '" + number + "' could not be read", 500);
  }
  return state;
}

function getPinJson(pin) {
  pin.state = getState(pin.number);
  return {
           'pin':   pin.number,
           'label': pin.label,
           'state': pin.state
         };
}

function getPinByNumber(number) {
  for (var i=0; i<config.pins.length; i++) {
    if (config.pins[i].number == number)
      return config.pins[i];
  }
  throw new config.error("GPIO pin '" + number + "' does not exist", 404);
}

function setState(number, state) {
  state = (state == 1) ? 1 : 0;
  var gpio = new Gpio(number, 'out');
  gpio.writeSync(state);
  gpio.unexport();
}
