var Gpio = require('onoff').Gpio,
  led = new Gpio(18, 'out'),
  iv;

iv = setInterval(function () {
  var state = led.readSync();
  console.log(state);
  led.writeSync(state ^ 1);
}, 500);

setTimeout(function () {
  clearInterval(iv);
  console.log('writing 1');
  //led.writeSync(1);
  console.log('unexporting');
  led.unexport();
}, 1500);
