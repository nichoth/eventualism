var { h, render } = require('preact')
var SSBClient = require('ssb-client')
var SSBConfig = require('ssb-config')
var SSBManifest = require('./manifest.json')
var connect = require('@nichoth/preact-connect')
var Bus = require('@nichoth/events')
var { struct, observ } = require('./lib')
var Effects = require('./effects')
var View = require('./view')
var evs = require('./EVENTS')

var state = struct({
    foo: observ('bar'),
    route: struct({}),
    homeRoute: struct({
        hello: observ('world')
    })
})

var KEYS = {
    id: process.env.KEYS_ID,
    public: process.env.KEYS_PUBLIC,
    private: process.env.KEYS_PRIVATE,
    curve: process.env.KEYS_CURVE
}

console.log('keys', KEYS)

var remote = ('ws://localhost:8989~shs:' +
    KEYS.id.substring(1, KEYS.id.indexOf('.')))

SSBClient(KEYS, {
    // using the main network
    remote: remote,
    caps: SSBConfig.caps,
    manifest: SSBManifest
}, function (err, sbot, config) {
    if (err) return console.log('err', err)
    console.log('wooo sbot')
})

var bus = Bus({ memo: true })
var effects = Effects({ state, view: bus })
var _view = connect({ state, bus, view: View })
render(h(_view), document.getElementById('content'))

if (process.env.NODE_ENV === 'development') {
    window.app = {
        state,
        effects,
        view: bus,
        evs
    }
}

