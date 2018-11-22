// require('dotenv').config()
var test = require('tape')
var Sbot = require('scuttle-testbot')
    .use(require('ssb-blobs'))
var patchSbot = require('../server/patch-sbot')

var sbot
test('setup', function (t) {
    sbot = patchSbot(Sbot())

    require('./publish')({ sbot, test: t.test })
    require('./rpc')({ sbot, test: t.test })
})

test('close', function (t) {
    sbot.close(() => t.end())
})




