var express      = require('express');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var moment       = require('moment');
var pinRouter    = require('./routes/pinRouter');
var authRouter   = require('./routes/authRouter');
var logRouter    = require('./routes/logRouter');
var app          = express();

app.use('/api', function (req, res, next) {
  res.startTime = moment();
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(authRouter.allowCrossDomain);

app.use('/api', pinRouter);
app.use('/api', authRouter);
app.use('/api', logRouter);

module.exports = app;
