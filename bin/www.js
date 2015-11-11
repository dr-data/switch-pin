var app = require('../app');
var pins = require('../services/pinService');
app.set('port', 80);

var server = app.listen(app.get('port'), function() {
  pins.cleanupPins();
  console.log('Listening on port ' + server.address().port);
});
