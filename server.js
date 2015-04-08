var express      = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    moment       = require('moment'),
    fs           = require('fs'),
    logger       = require('./logger'),
    web          = require('./web'),
    pins         = require('./pins'),
    port         = 80,
    app          = express().use(bodyParser.json())
                            .use(cookieParser());

app.use('/api*', function (request, response, next) {
  pins.validateUser(request, response);
  next();
});

app.route('/')
.get(function(request, response, next) {
  web.page(request, response);
  next();
});

app.route('/log*')
.get(function(request, response, next) {
  logger.showLog(response);
  next();
});

app.route('/api/secret/:secret')
.get(function(request, response, next) {
  pins.verifySecret(request, response);
  next();
});

app.route('/api/cookie/:password')
.get(function(request, response, next) {
  pins.cookieRequest(request, response);
  next();
});

app.route('/api/pins/')
.get(function(request, response, next) {
  pins.getRequest(request, response);
  next();
});

app.route('/api/pins/:id')
.get(function(request, response, next) {
  pins.getRequest(request, response);
  next();
})
.put(function(request, response, next) {
  pins.putRequest(request, response);
  next();
})
.options(function(request, response, next) {
  pins.optionRequest(request, response);
  next();
});

app.listen(port);

logger.writeLog("[" + moment().format('DD-MMM-YYYY') + "] [" + moment().format('HH:mm:ss:SSS') + "] [server start] <br>");