Webtask script to check sites status and health
===============================================

Small app that runs as a cron script on [Webtask](https://webtask.io)
platform and **checks if an URL get a response**, and allows also to check
if the **body match** with a given string or a regex expression.

If the check fails posts a message in a [Slack](https://slack.com) channel.


Run
---

Install on Webtask platform as a cron service running every 2 minutes with:

    $ wt cron schedule \
         -n checkcron \
         --secret "URL=http://theurltocheck.com/path/to/uri" \
         --secret STATUS=200 \
         --secret TIMEOUT=5000 \
         --secret "BODY=Text expected" \
         --secret "REGEX=Regex expression" \
         --secret SLACK_TOKEN=THETOKEN \
         --secret SLACK_CHANNEL=CHANNELNAME \
         "*/2 * * * *" \
         check.js

### Options

* `-n checkcron`: the name of the cron process.
* `--secret URL`: The URL to check.
* `--secret STATUS`: (optional) The status expected, default 200.
* `--secret TIMEOUT`: (optional) Milliseconds to wait the response
  before aborting the request, default 10000 (10 seconds).
* `--secret BODY`: (optional) A text expected in the body.
* `--secret REGEX`: (optional), regex expression expected to match.
* `--secret SLACK_TOKEN`: the Slack API token, go to https://api.slack.com/docs/oauth-test-tokens
  to get a token.
* `--secret SLACK_CHANNEL`: the channel where to post the alerts.
* `"*/2 * * * *"`: _cron_ configuration (eg. run every 2 min).


You can also install the script directly to Webtask platform without
having this project downloaded in your local machine with:

    $ wt cron schedule [OPTIONS] \
         https://raw.githubusercontent.com/mrsarm/wt-check/master/check.js

To see more options of _Webtask CLI_ go to https://webtask.io/docs.

About
-----

**Source code**: https://github.com/mrsarm/wt-check

**Author**: Mariano Ruiz <mrsarm@gmail.com>

2016  |  Apache-2.0
