var config = require('../auth/config');
var repo = require('../repositories/pinRepository');

exports.setPin = function (number, state) {
  pin = getPinByNumber(number);
  repo.setState(number, state);
  pin.state = repo.getState(pin.number);
  return pin;
};

exports.getPin = function (number) {
  return getPinByNumber(number);
};

exports.getPins = function () {
  var availablePins = [];
  config.pins.forEach(function(pin) {
    pin.state = repo.getState(pin.number);
    availablePins.push(pin);
  });
  return availablePins;
};

function getPinByNumber(number) {
  for (var i=0; i<config.pins.length; i++) {
    var pin = config.pins[i];
    if (pin.number == number) {
      pin.state = repo.getState(pin.number);
      return pin;
    }
  }
  throw new config.error("GPIO '" + number + "' does not exist", 404);
}
