var { h, render } = require('preact')
var S = require('pull-stream')
var connect = require('@nichoth/preact-connect')
var catchRoutes = require('@nichoth/catch-routes')
var Bus = require('@nichoth/events')
var Effects = require('./effects')
var RouteEffects = require('./router/effects')
var subscribeToView = require('./effects/subscribe-to-view')
var { createState } = require('./state')
var View = require('./view')
var evs = require('./EVENTS')

var state = createState()
var routeEffects = RouteEffects({ state })
var bus = Bus({ memo: true })
catchRoutes(parsedUrl => {
    state.route.set(parsedUrl)
    routeEffects(parsedUrl)
})

var effects = Effects({ state })
var _view = connect({ state, bus, view: View })
render(h(_view), document.getElementById('content'))

if (process.env.NODE_ENV === 'development') {
    window.S = S
    window.app = {
        state,
        effects,
        view: bus,
        evs
    }
}

effects.connectSbot(function (err, sbot) {
    if (err) return
    if (process.env.NODE_ENV === 'development') window.sbot = sbot
    subscribeToView({ sbot, effects, view: bus })
    effects.getMessages(sbot)
})

