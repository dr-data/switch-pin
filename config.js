var Gpio         = require('onoff').Gpio;

//switch
exports.password = "password";
exports.secret   = "secret";
exports.domain   = [
                    "domain"
                   ];
exports.pins     = [
                      {'gpio':new Gpio(17,'out'), 'label':'lights'},
                      {'gpio':new Gpio(18,'out'), 'label':'stereo'}
                      {'gpio':new Gpio(27,'out'), 'label':'other'}
                   ];

// fitbit
exports.CONSUMER_KEY    = "key";
exports.CONSUMER_SECRET = "secret";
exports.DEVICE_ID       = "id";
exports.DEFAULT_WAKEUP  = "9:00am";