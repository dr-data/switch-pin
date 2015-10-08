var port         = 80,
    express      = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    moment       = require('moment'),
    fs           = require('fs'),
    fitbit       = require('./fitbit'),
    logger       = require('./logger'),
    web          = require('./web'),
    pins         = require('./pins'),
    cron         = require('cron').CronJob,
    app          = express().use(bodyParser.json())
                            .use(cookieParser());

// ----------=== fitbit ===---------- //

app.get("/fitbit/fitbit?*", function (request, response) {
  fitbit.handler(request, response);
});

app.get("/go", function (request, response) {
  fitbit.logFitbitActivity(response);
});

// --------=== switch-pin ===-------- //

app.use('/api*', function (request, response, next) {
  pins.validateUser(request, response);
  next();
});

app.route('/log*')
.get(function(request, response, next) {
  logger.showLog(response);
  next();
});

app.route('/api/secret/')
.put(function(request, response, next) {
  request.aim = logger.aim.SECRET;
  pins.verifySecret(request, response);
  next();
})
.options(function(request, response, next) {
  pins.optionRequest(request, response);
  next();
});

app.route('/api/password/')
.put(function(request, response, next) {
  request.aim = logger.aim.PASSWORD;
  pins.cookieRequest(request, response);
  next();
})
.options(function(request, response, next) {
  pins.optionRequest(request, response);
  next();
});

app.route('/api/pins/')
.get(function(request, response, next) {
  request.aim = logger.aim.STATUS;
  pins.getRequest(request, response);
  next();
});

app.route('/api/pins/:id')
.get(function(request, response, next) {
  request.aim = logger.aim.STATUS;
  pins.getRequest(request, response);
  next();
})
.put(function(request, response, next) {
  request.aim = logger.aim.SWITCH;
  pins.putRequest(request, response);
  fitbit.setAlarm(request, response);
  next();
})
.options(function(request, response, next) {
  pins.optionRequest(request, response);
  next();
});

app.listen(port);

logger.writeLog("[" + moment().format('DD-MMM-YYYY') + "] [" + moment().format('HH:mm:ss:SSS') + "] [server start] <br>");