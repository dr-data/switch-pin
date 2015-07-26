var Gpio         = require('onoff').Gpio;

//switch
exports.password = "happygiraffe";
exports.secret   = "Qt3vMizCHKOsiGi1k8Dm2apzUIAet0qrEwZjvaAh";
exports.domain   = [
                    "http://mindsoon.com",
                    "http://www.mindsoon.com"
                   ];
exports.pins     = [
                      {'gpio':new Gpio(17,'out'), 'label':'lights'},
                      {'gpio':new Gpio(18,'out'), 'label':'stereo'}
                      //{'gpio':new Gpio(27,'out'), 'label':'other'}
                   ];

// fitbit
exports.CONSUMER_KEY    = "605f22d445f0f08420274e71368e513a";
exports.CONSUMER_SECRET = "216d72903ce62c59a1421be4fa6e5996";
exports.DEVICE_ID       = "37715528";
exports.DEFAULT_WAKEUP  = "9:00am";