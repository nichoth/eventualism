var ssbKeys = require('ssb-keys')
var ssbConfigInject = require('ssb-config/inject')
var path = require('path')
var sbot = require('scuttlebot')

// @TODO check if global sbot is running and use that if possible
module.exports = function startSSB() {
    var config = ssbConfigInject()

    // var config = ssbConfigInject('woo-testing', {
    //     // Path to the application data folder, which contains the
    //     // private key, message attachment data (blobs) and the
    //     // leveldb backend
    //     // path: '/foo/bar'
    // })

    var keyPath = path.join(config.path, 'secret')
    config.keys = ssbKeys.loadOrCreateSync(keyPath)
    // config.logging.level = ''

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



// var KEYS = {
//     id: process.env.KEYS_ID,
//     public: process.env.KEYS_PUBLIC,
//     private: process.env.KEYS_PRIVATE,
//     curve: process.env.KEYS_CURVE
// }

// console.log('keys', KEYS)

// var remote = ('ws://localhost:8989~shs:' +
//     KEYS.id.substring(1, KEYS.id.indexOf('.')))

// SSBClient(KEYS, {
//     // using the main network
//     remote: remote,
//     caps: SSBConfig.caps,
//     manifest: SSBManifest
// }, function (err, sbot, config) {
//     if (err) return console.log('err', err)
//     console.log('wooo sbot')
// })


