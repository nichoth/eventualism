var { h, render } = require('preact')
var connect = require('@nichoth/preact-connect')
var Bus = require('@nichoth/events')
var S = require('pull-stream')
var wsClient = require('pull-ws/client')
var muxrpc = require('muxrpc')
var { struct, observ } = require('./lib')
var Effects = require('./effects')
var View = require('./view')
var evs = require('./EVENTS')
var manifest = require('../manifest.json')
var WS_URL = 'ws://localhost:8000'

wsClient(WS_URL, {
    binary: true,
    onConnect
})

function onConnect (err, wsStream) {
    if (err) throw err
    console.log('got ws connection')

    // sbot is rpc client
    var sbot = muxrpc(manifest, null)()
    var rpcStream = sbot.createStream(function onEnd (err) {
        console.log('rpc stream close', err)
    })
    S(wsStream, rpcStream, wsStream)

    // console.log('rpc keys', Object.keys(sbot))

    sbot.whoami(function () {
        console.log('whoami', arguments)
    })
}

var state = struct({
    foo: observ('bar'),
    route: struct({}),
    homeRoute: struct({
        hello: observ('world')
    })
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

