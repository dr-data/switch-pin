var fs            = require('fs'),
    moment        = require('moment'),
    logger        = require('./logger'),
    config        = require('./config'),
    codes         = {
                      SUCCESSFUL: 200,
                      INVALID_BODY: 400,
                      INVALID_SECRET: 401,
                      INVALID_PASSWORD: 402,
                      INVALID_IP: 403,
                      INVALID_RESOURCE: 404,
                      INVALID_STATE: 409,
                      CANNOT_READ_GPIO: 500,
                      CANNOT_WRITE_GPIO: 599
                    };

exports.getRequest = function (request, response) {
  var log = generateLog(request);
  validateInput(log);
  createOutput(response, log);
};

exports.optionRequest = function (request, response) {
  setPermissions(response);
  response.sendStatus(codes.SUCCESSFUL);
};

exports.putRequest = function (request, response) {
  var log = generateLog(request);
  validateInput(log);
  if (log.isSuccessful()) {
    log.code = setPin(log.resource, log.state);    
  }
  createOutput(response, log);
};

exports.validateUser = function (request, response) {
  request.startTime = Date.now();
  request.logCode = codes.SUCCESSFUL;

  if (request.method == "PUT" && request.body.secret != config.secret) {
    request.logCode = codes.INVALID_SECRET;
  }

  if (request.headers.origin != config.domain) {
    request.logCode = codes.INVALID_IP;
  }
};

function validateInput(log) {
  var isResourceValid = (log.resource == "") ? true : false;
  config.pins.forEach(function(gpio) {
    if (gpio.gpio.gpio == log.resource) {
      isResourceValid = true;
    }
  });

  if (log.method == 'PUT' && [0,1].indexOf(log.state) < 0) {
    log.code = codes.INVALID_BODY;
  }
  if (!isResourceValid) {
    log.code = codes.INVALID_RESOURCE;
  }
}

exports.cookieRequest = function (request, response) {
  var log = generateLog(request);
  log.password = request.params.password;
  createOutput(response, log);
};

exports.verifySecret = function (request, response) {
  var log = generateLog(request);
  log.secret = request.params.secret;
  createOutput(response, log);
};

function createOutput(response, log) {
  var answer = getAnswer(log)
  setPermissions(response);
  commitLog(log);
  if (log.isSuccessful()) {
    response.json(answer).status(codes.SUCCESSFUL);
  } else {
    response.status(log.code);
  }
}

function setPermissions(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization', 'Content-Length');
}

function getAnswer(log) {
  if (log.password) {
    return getCookie(log);
  } else if (log.secret) {
    return getVerification(log);
  } else if (log.isSuccessful()) {
    return readPins(log);
  } else {
    return {};
  }
}

function getCookie(log) {
  if (log.isPasswordValid()) {
    return {'secret':config.secret};
  } else {
    log.code = codes.INVALID_PASSWORD;
    return {};
  }
}

function getVerification(log) {
  log.code = (log.isSecretValid()) ? codes.SUCCESSFUL : codes.INVALID_SECRET;
  return {};
}

function readPins(log) {
  var answer = [];
  config.pins.forEach(function(gpio) {
    var currentState = gpio.gpio.readSync();
    log.endState += currentState;
    if (log.resource == "" || log.resource == gpio.gpio.gpio) {
      answer.push({
                    'pin':   gpio.gpio.gpio,
                    'label': gpio.label,
                    'state': currentState
                  });
      if ([0,1].indexOf(currentState) < 0) {
        log.code = codes.CANNOT_READ_GPIO;
      }
    }
  });
  return {'pins':answer};
}

function setPin(resource, state) {
  var isSwitchAlreadySwitched = true;
    config.pins.forEach(function(gpio) {
    if (resource == gpio.gpio.gpio && gpio.gpio.readSync() != state) {
      gpio.gpio.writeSync(state);
      isSwitchAlreadySwitched = false;
      if (gpio.gpio.readSync() != state) {
        return codes.CANNOT_WRITE_GPIO;
      }
    }
  });
  if (isSwitchAlreadySwitched) {
    return codes.INVALID_STATE;
  }
  return codes.SUCCESSFUL;
}

function generateLog(request) {
  var state = (['0','1'].indexOf(request.body.state) >= 0) ? parseInt(request.body.state) : ""; 
  return {
           'startTime'    : request.startTime,
           'ip'           : request.connection.remoteAddress,
           'method'       : request.method,
           'resource'     : request.params.id || "",
           'state'        : state,
           'endState'     : "",
           'dateStamp'    : moment().format('DD-MMM-YYYY'),
           'timeStamp'    : moment().format('HH:mm:ss:SSS'),
           'code'         : request.logCode,
           isSuccessful   : function() { return (this.code == codes.SUCCESSFUL); },
           isPasswordValid: function() { return (this.password == config.password); },
           isSecretValid  : function() { return (this.secret == config.secret); }
         };
}

function commitLog(log) {
  log.totalTime = Date.now() - log.startTime;
  var content = "";

  if (log.method == "PUT") {
    content = log.endState + " " + log.resource + ":" + log.state;
  } else if (log.method == "GET" && log.password) {
    content = "cookie";
  } else if (log.method == "GET" && log.secret) {
    content = "secret"
  } else {
    content = log.endState;    
  }

  log.message   = "[" + log.dateStamp + "] [" + log.timeStamp + "] [" + log.method + "-" + log.code +
                  "] [" + log.ip + "] [" + content + "] " + log.totalTime + "ms<br>";

  logger.writeLog(log.message, log.method);
}