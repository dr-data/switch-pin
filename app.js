var express    = require('express');
var bodyParser = require('body-parser');
var pinRouter  = require('./routes/pinRouter');
var moment     = require('moment');
var app        = express();

app.use('/api', function (req, res, next) {
  res.startTime = moment();
  next();
});

// var connectionString='here'

app.use(bodyParser.json());
app.use('/api', pinRouter);
// app.use('/api', activityRouter);

module.exports = app;
