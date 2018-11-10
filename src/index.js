var { h, render } = require('preact')
var connect = require('@nichoth/preact-connect')
var catchRoutes = require('@nichoth/catch-routes')
var Bus = require('@nichoth/events')
var Effects = require('./effects')
var { createState } = require('./state')
var View = require('./view')
var evs = require('./EVENTS')

var state = createState()
var bus = Bus({ memo: true })
catchRoutes(parsedUrl => state.route.set(parsedUrl))

var effects = Effects({ state })
effects.subscribeToView({ view: bus })
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

