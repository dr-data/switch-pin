var Gpio         = require('onoff').Gpio;

// sample content for the config file
// it can handle any number of gpio pins

exports.password = "password";
exports.domain   = "http://example.com";
exports.secret   = "alonghashstringhere";
exports.pins     = [
                      {'gpio':new Gpio(17,'out'), 'label':'lights 1'},
                      {'gpio':new Gpio(18,'out'), 'label':'lights 2'}
                   ];