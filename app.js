var express = require('express');
var bodyParser = require('body-parser');
var pins = require('./routes/pins');
// var logs = require('./routes/logs');
// var activities = require('./routes/activities');
var app = express();

// var connectionString='something here'

app.use(bodyParser.json());
app.use('/api', pins);
// app.use('/api', logs);
// app.use('/api', activities);

module.exports = app;
