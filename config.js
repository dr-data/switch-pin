var Gpio         = require('onoff').Gpio;

// switch-pin
exports.password = "password";
exports.domain   = "http://example.com";
exports.secret   = "alonghashstringhere";
exports.pins     = [
                      {'gpio':new Gpio(17,'out'), 'label':'lights 1'},
                      {'gpio':new Gpio(18,'out'), 'label':'lights 2'}
                   ];

// fitbit
exports.CONSUMER_KEY    = "32characterwithnumbersandletters";
exports.CONSUMER_SECRET = "32characterwithnumbersandletters";
exports.DEVICE_ID       = "12345678";
exports.DEFAULT_WAKEUP  = "9:00am";
