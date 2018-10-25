var { h, render } = require('preact')
var connect = require('@nichoth/preact-connect')
var Bus = require('@nichoth/events')
var { struct, observ } = require('./lib')
var Effects = require('./effects')
var View = require('./view')
var evs = require('./EVENTS')

var bus = Bus({ memo: true })
var state = struct({
    route: struct({}),

    sbotConnection: struct({
        isResolving: observ(false),
        error: observ(null),
        isConnected: observ(false)
    }),

    messages: struct({
        data: observ([])
    })
})

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

effects.connectSbot(function (err, sbot) {
    if (err) return
    sbot.whoami(function (err, res) {
        console.log('whoami', err, res)
    })

    effects.getMessages(sbot)
})


