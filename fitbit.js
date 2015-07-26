var express        = require("express"),
    datejs         = require('datejs'),
    FBitClient     = require("fitbit-node"),
    config         = require('./config'),
	app            = express(),
	client         = new FBitClient(config.CONSUMER_KEY, config.CONSUMER_SECRET),
    AUTH_URL       = "http://www.fitbit.com/oauth/authenticate?oauth_token=",
    ALARMS_URI     = "/devices/tracker/" + config.DEVICE_ID + "/alarms.json",
    ACTIVITIES_URI = "/activities.json",
    tokens         = [];
    secrets        = [];
    verifiers      = [];
    numberPasses   = 0;

exports.handler = function (req, res) {
    if (numberPasses < 2) {
        getAuthToken(req, res);
    } else {
        verifiers[numberPasses-1] = req.query.oauth_verifier;
        numberPasses = 0;
        getFitbitResource(ALARMS_URI, ACTIVITIES_URI);
        res.end();
    }
};

function getAuthToken(req, res){
    client.getRequestToken().then(function (results) {
        tokens[numberPasses] = results[0];
        secrets[numberPasses] = results[1];
        verifiers[numberPasses-1] = (numberPasses > 0) ? req.query.oauth_verifier : "";
        numberPasses++;
        res.redirect(AUTH_URL + results[0]);
    }, function (error) {
        res.send(error);
    });
}

function getFitbitResource(uri1, uri2){

    // for testing purposes only...
    for (var i=0;i<tokens.length;i++){
        console.log("   (token    #" + i + ": " + tokens[i] + ")");
        console.log("   (secret   #" + i + ": " + secrets[i] + ")");
        console.log("   (verifier #" + i + ": " + verifiers[i] + ")");
    }

    var activity = {};
    client.getAccessToken(tokens[0], secrets[0], verifiers[0])
    .then(function (results) {
        accessToken = results[0];
        accessSecret = results[1];
        client.requestResource(uri1, "GET", accessToken, accessSecret)
        .then(function (results) {
            resource = JSON.parse(results[0]);
            activity = getActivity(resource.trackerAlarms);
        }).then(
            client.getAccessToken(tokens[1], secrets[1], verifiers[1])
            .then(function (results) {
                accessToken = results[0];
                accessSecret = results[1];
                // setup parameters for post here...
                client.requestResource(uri2, "POST", accessToken, accessSecret)
                .then(function (results) {
                    resource = JSON.parse(results[0]);
                    console.log(resource);
                });
            }, function (error) {
                res.send(error);
            })
        );
    }, function (error) {
        res.send(error);
    });
}

// setup parameters of activity object
function getActivity(alarms){
    var a = {};
    a.activityName = "lightsOff";
    a.now = Date.today().setTimeToNow();
    a.startTime = activity.now.toString("HH:mm");
    a.date = activity.now.toString("yyyy-MM-dd");
    a.durationMillis = ( getNextAlarm(activity.now, alarms).getTime() - activity.now.getTime() ) * 1000;
    return a;
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
