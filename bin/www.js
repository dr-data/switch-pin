var app = require('../app');
app.set('port', 80);

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + server.address().port);
});
