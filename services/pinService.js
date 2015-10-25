var log     = require('../services/logService');
var config  = require('../config/config');
var pinRepo = require('../repositories/pinRepository');

exports.setPin = function (number, state) {
  pin = getPinByNumber(number);
  pinRepo.setState(number, state);
  pin.state = pinRepo.getState(pin.number);
  verifyState(number, state, pin.state);
  return pin;
};

exports.getPin = function (number) {
  return getPinByNumber(number);
};

exports.getPins = function () {
  var availablePins = [];
  config.pins.forEach(function(pin) {
    pin.state = pinRepo.getState(pin.number);
    availablePins.push(pin);
  });
  return availablePins;
};

function getPinByNumber(number) {
  for (var i=0; i<config.pins.length; i++) {
    var pin = config.pins[i];
    if (pin.number == number) {
      pin.state = pinRepo.getState(pin.number);
      return pin;
    }
  }
  throw new log.error("GPIO " + number + " does not exist", 404);
}

function verifyState(number, requestedState, actualState) {
  if (requestedState != actualState) {
    throw new log.error("Cannot write GPIO " + number + " from " + actualState + " to " + requestedState , 501);
  }
}
