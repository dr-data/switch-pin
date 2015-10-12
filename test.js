var Gpio = require('onoff').Gpio,
  led = new Gpio(18, 'out'),
  iv;

iv = setInterval(function () {
  var state = led.readSync();
  console.log(state);
  led.writeSync(state ^ 1);
}, 200);

setTimeout(function () {
  clearInterval(iv);
  led.writeSync(0);
  led.unexport();
}, 5000);
