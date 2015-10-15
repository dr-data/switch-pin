var express    = require('express');
var bodyParser = require('body-parser');
var moment     = require('moment');
var pinRouter  = require('./routes/pinRouter');
var app        = express();

app.use('/api', function (req, res, next) {
  res.startTime = moment();
  next();
});

app.use(bodyParser.json());
app.use('/api', pinRouter);

module.exports = app;
