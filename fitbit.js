var express           = require("express"),
    datejs            = require('datejs'),
    FBitClient        = require("fitbit-node"),
    CronJob           = require('cron').CronJob,
    config            = require('./config'),
	app               = express(),
	client            = new FBitClient(config.CONSUMER_KEY, config.CONSUMER_SECRET),
    AUTH_URL          = "http://www.fitbit.com/oauth/authenticate?oauth_token=",
    ALARMS_URI        = "/devices/tracker/" + config.DEVICE_ID + "/alarms.json",
    ACTIVITIES_URI    = "/activities.json",
    activity          = {},
    tokenSecrets      = {},
    cronJob           = null,
    isPostingActivity = false;

// begin the request chain by requesting fitbit authentication
exports.logFitbitActivity = function (res) {
    isPostingActivity = false;
    getRequestToken(res);
};

// handle incoming request token and set alarm or post activity
exports.handler = function (req, res) {
    if (isPostingActivity) {
        postFitbitActivity(req, res);
    } else {
        getAndSetAlarm(req, res);
    }
};

// get generic token from fitbit
function getRequestToken(res) {
    client.getRequestToken().then(function (results) {
        var token = results[0],
            secret = results[1];
        tokenSecrets[token] = secret;
        res.redirect(AUTH_URL + token);
    }, function (error) {
        res.send(error);
    });
}

// get fitbit alarms and set next as global variable
function getAndSetAlarm(req, res) {
    var token = req.query.oauth_token,
        secret = tokenSecrets[token],
        verifier = req.query.oauth_verifier;
    client.getAccessToken(token, secret, verifier).then(function (results) {
        var accessToken = results[0],
            accessSecret = results[1];
        client.get(ALARMS_URI, accessToken, accessSecret, config.USER_ID).then(function (results) {
            var resource = JSON.parse(results[0]);
            var now = Date.today().setTimeToNow();
            var nextAlarm = getNextAlarm(now, resource.trackerAlarms);
            var duration = nextAlarm.getTime() - now.getTime();
            activity = newActivity("sleep", now, duration);
            setCronJob(res, nextAlarm.getTime());
        });
    }, function (error) {
        res.send(error);
    });
}

// set cronJob for 1 minute after alarm
function setCronJob(res, alarm) {
    var timeOfCronJob = new Date(alarm + 1000);
    var cronFunction = function() {
        isPostingActivity = true;
        getRequestToken(res);
    }

    if (cronJob) {
        cronJob.stop();
    }

    cronJob = new CronJob({
        cronTime: timeOfCronJob,
        onTick: cronFunction,
        start: false,
        timeZone: "America/New_York"
    });
    cronJob.start();
}

// post the global activity object
function postFitbitActivity(req, res) {
    var token = req.query.oauth_token,
        secret = tokenSecrets[token],
        verifier = req.query.oauth_verifier;
    client.getAccessToken(token, secret, verifier).then(function (results) {
        var accessToken = results[0],
            accessSecret = results[1];
        client.post(ACTIVITIES_URI, accessToken, accessSecret, activity, config.USER_ID).then(function (results) {
            resource = JSON.parse(results[0]);
        });
    }, function (error) {
        res.send(error);
    });
}

// setup parameters of activity object
function newActivity(name, now, duration) {
    var newActivity = {};
    newActivity.activityName = name;
    newActivity.startTime = now.toString("HH:mm");
    newActivity.date = now.toString("yyyy-MM-dd");
    newActivity.manualCalories = 1;
    newActivity.durationMillis = duration;
    return newActivity;
}

// gets next alarm from json object
function getNextAlarm(now, alarms) {
    nextAlarm = getDefaultWakeupTime(now);
    for (i in alarms) {
        alarm = alarms[i];
        if (alarm.recurring && alarm.enabled) {
            for (j in alarm.weekDays) {
                thisAlarm = getDateFromDay(alarm.weekDays[j]).at(alarm.time);
                nextAlarm = (nextAlarm < thisAlarm) ? nextAlarm : thisAlarm;
            }
        }
    }
    return nextAlarm;
}

// gets next default wakeup time (today's or tomorrow's)
function getDefaultWakeupTime(now) {
    todaysAlarm = Date.today().at(config.DEFAULT_WAKEUP);
    tomorrowsAlarm = Date.parse("tomorrow").at(config.DEFAULT_WAKEUP);
    return (now < todaysAlarm) ? todaysAlarm : tomorrowsAlarm;
}

// parses oauth tokens from req.url /fitbit/fitbit?oauth_token=[1]&oauth_verifier=[2]
function getTokenAndVerifier(url) {
    regex = /\/fitbit\/fitbit\?oauth_token=([a-z0-9]{32})&oauth_verifier=([a-z0-9]{32})/;
    return url.match(regex);
}

// converts day as string to date object
function getDateFromDay(day) {
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
