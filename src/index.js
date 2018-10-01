var { h, render } = require('preact')
var connect = require('@nichoth/preact-connect')
var Bus = require('@nichoth/events')
var { struct, observ } = require('./lib')
var connectSbot = require('./connect-sbot')
var Effects = require('./effects')
var View = require('./view')
var evs = require('./EVENTS')

connectSbot({
    onClose: function (err) {
        console.log('rpc close', err)
    }
}, function onConnect (err, sbot) {
    if (err) throw err
    console.log('got ws sbot')
    sbot.whoami(function () {
        console.log('whoami', arguments)
    })
})

var state = struct({
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

