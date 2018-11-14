var ssbKeys = require('ssb-keys')
var ssbConfigInject = require('ssb-config/inject')
var path = require('path')
var sbot = require('scuttlebot')

// @TODO check if global sbot is running and use that if possible
module.exports = function startSSB() {
    var {
        SBOT_SHS,
        SBOT_SIGN,
        APP_NAME,
        NODE_ENV
    } = process.env
    console.log('env', SBOT_SHS, SBOT_SIGN, APP_NAME, NODE_ENV)

    var config = ssbConfigInject(APP_NAME || undefined)
    console.log('config', config)

    var keyPath = path.join(config.path, 'secret')
    config.keys = ssbKeys.loadOrCreateSync(keyPath)
    // error, warning, notice, or info (Defaults to notice)
    config.logging.level = 'notice'

    return sbot
        .use(require('scuttlebot/plugins/plugins'))
        .use(require('scuttlebot/plugins/master'))
        .use(require('scuttlebot/plugins/gossip'))
        .use(require('scuttlebot/plugins/replicate'))
        .use(require('ssb-friends'))
        .use(require('ssb-blobs'))
        .use(require('ssb-serve-blobs'))
        .use(require('ssb-backlinks'))
        .use(require('ssb-private'))
        .use(require('ssb-about'))
        .use(require('ssb-contacts'))
        .use(require('ssb-query'))
        .use(require('scuttlebot/plugins/invite'))
        .use(require('scuttlebot/plugins/local'))
        .call(null, config)
}

