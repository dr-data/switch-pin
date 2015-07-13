var express      = require("express"),
    datejs       = require('datejs'),
    FBitClient   = require("fitbit-node"),
    config       = require('./config'),
	app          = express(),
	client       = new FBitClient(config.CONSUMER_KEY, config.CONSUMER_SECRET),
    AUTH_URL     = "http://www.fitbit.com/oauth/authenticate?oauth_token=",
    ALARMS_URI   = "/devices/tracker/" + config.DEVICE_ID + "/alarms.json",
	tokenSecrets = {};

exports.authenticator = function (req, res) {
    getAuthToken(req, res);
};

exports.handler = function (req, res) {
    getFitbitResource(ALARMS_URI, req.query.oauth_token, req.query.oauth_verifier);
    res.end();
};

function getFitbitResource(uri, token, verifier){
    secret = tokenSecrets[token];
    client.getAccessToken(token, secret, verifier)
    .then(function (results) {
        accessToken = results[0];
        accessSecret = results[1];
        client.requestResource(uri, "GET", accessToken, accessSecret)
        .then(function (results) {
            resource = JSON.parse(results[0]);
            startTime = Date.today().setTimeToNow();
            endTime = getNextAlarm(startTime, resource.trackerAlarms);
            console.log("from " + startTime + " to " + endTime);
        });
    }, function (error) {
        res.send(error);
    });
}

function getAuthToken(req, res){
     client.getRequestToken().then(function (results) {
        token = results[0];
        secret = results[1];
        tokenSecrets[token] = secret;
        res.redirect(AUTH_URL + token);
    }, function (error) {
        res.send(error);
    });
}

// returns next alarm from json object
function getNextAlarm(now, alarms){
    nextAlarm = getDefaultWakeupTime(now);
    for (i in alarms) {
        alarm = alarms[i];
        if (alarm.recurring && alarm.enabled) {
            for (j in alarm.weekDays){
                thisAlarm = getDateFromDay(alarm.weekDays[j]).at(alarm.time);
                nextAlarm = (nextAlarm < thisAlarm) ? nextAlarm : thisAlarm;
            }
        }
    }
    return nextAlarm;
}

// returns next default wakeup time (today's or tomorrow's)
function getDefaultWakeupTime(now){
    todaysAlarm = Date.today().at(config.DEFAULT_WAKEUP);
    tomorrowsAlarm = Date.parse("tomorrow").at(config.DEFAULT_WAKEUP);
    return (now < todaysAlarm) ? todaysAlarm : tomorrowsAlarm;
}

// parses oauth tokens from req.url /fitbit/fitbit?oauth_token=[1]&oauth_verifier=[2]
function getTokenAndVerifier(url){
    regex = /\/fitbit\/fitbit\?oauth_token=([a-z0-9]{32})&oauth_verifier=([a-z0-9]{32})/;
    return url.match(regex);
}

// converts day as string to date object
function getDateFromDay(day){
    switch(day) {
    case "MONDAY":
        return Date.today().next().monday();
    case "TUESDAY":
        return Date.today().next().tuesday();
    case "WEDNESDAY":
        return Date.today().next().wednesday();
    case "THURSDAY":
        return Date.today().next().thursday();
    case "FRIDAY":
        return Date.today().next().friday();
    case "SATURDAY":
        return Date.today().next().saturday();
    case "SUNDAY":
        return Date.today().next().sunday();
    default:
        return null;
    }
}
