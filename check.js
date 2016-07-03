"use latest";

var request = require('request');

module.exports = function (context, callback) {

  let { URL, STATUS, BODY, TIMEOUT, REGEX, SLACK_TOKEN, SLACK_CHANNEL } = context.data;

  if (!URL) return callback(new Error('"URL" secret is missing.'));
  if (!SLACK_TOKEN) return callback(new Error('"SLACK_TOKEN" secret is missing.'));
  if (!SLACK_CHANNEL) return callback(new Error('"SLACK_CHANNEL" secret is missing.'));
  if (!STATUS) STATUS = 200;
  if (!TIMEOUT) TIMEOUT = "10000";

  console.log("Checking GET " + URL + " ...");
  request({ url: URL, method: 'GET', timeout: parseInt(TIMEOUT) }, function (error, res, body) {
    if (error) {
      var err = error.code ? "[" + error.code + "] " : "";
      err += error.message ? error.message : error.toString();
      slackLog("wt-check Error: GET " + URL + " fails with error - " + err,
               callback, SLACK_TOKEN, SLACK_CHANNEL);
    }
    else if (res.statusCode != STATUS) {
      slackLog("wt-check Error: GET " + URL
               + " returns " + res.statusCode + " Status instead of " + STATUS + " Status.",
               callback, SLACK_TOKEN, SLACK_CHANNEL);
    }
    else if (BODY && body.indexOf(BODY)<0) {
      slackLog("wt-check Error: GET " + URL
               + " doesn't match the string \"" + BODY + "\".",
               callback, SLACK_TOKEN, SLACK_CHANNEL);
    }
    else if (REGEX && !(new RegExp(REGEX).exec(body))) {
      slackLog("wt-check Error: GET " + URL
               + " doesn't match the regex \"" + REGEX + "\".",
               callback, SLACK_TOKEN, SLACK_CHANNEL);
    } else {
      callback(null, getTime() + " wt-check: Check GET " + URL + " done successfully.");
    }
  });
};

function slackLog(message, callback, token, channel) {
  console.log(message);
  var url = 'https://slack.com/api/chat.postMessage'
    + '?token=' + token + '&channel=' + channel
    + '&username=Webtask Check&as_user=false'
    + '&text=' + encodeURIComponent(getTime()+ " " + message);
  request({ url: url, method: 'POST' }, function (error, res, body) {
    callback(error, getTime()+ " " + message);
  });
}

function getTime() {
  return "[" + (new Date()).toISOString() + "]";
}
