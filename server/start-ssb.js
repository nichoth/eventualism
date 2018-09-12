var ssbKeys = require('ssb-keys')
var ssbConfigInject = require('ssb-config/inject')
var path = require('path')

module.exports = function startSSB() {
    var config = ssbConfigInject()
    var keyPath = path.join(config.path, 'secret')
    config.keys = ssbKeys.loadOrCreateSync(keyPath)
    // config.logging.level = ''

    return require('scuttlebot/index')
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

