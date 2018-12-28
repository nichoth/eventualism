var Sbot = require('scuttlebot/index')
    .use(require('scuttlebot/plugins/gossip'))
    .use(require('ssb-blobs'))
var patchSbot = require('../server/patch-sbot')
var ssbKeys = require('ssb-keys')

module.exports = function ({ sbot, test }) {
    var alice = ssbKeys.generate()
    var sbot2 = patchSbot(Sbot({
        temp: 'gossip',
        keys: alice,
        timeout: 1000
    }))

    test('gossip', function (t) {
        if (require.main === module) sbot.close()
        t.end()
    })
}

if (require.main === module) {
    var Testbot = require('scuttle-testbot')
        .use(require('ssb-blobs'))

    module.exports({
        sbot: patchSbot(Testbot()),
        test: require('tape')
    })
}

