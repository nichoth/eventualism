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


// @TODO
// * [ ] button and api method to 'follow' someone
// * [ ] test that gossip is ok
// * [ ] e2e test with cypress
// * [ ] preview of image file
// * [ ] show visual feedback when you submit the form for new posts
// * [ ] post/:key route -- need to ask sbot for the image if it's not in
//          memory
// * [ ] live updates from the message feed, where we get the initial list.
//      This should probably have a 'notification' type of thing with
//      a button to show new posts
// * [ ] route to view your profile
// * [ ] route to see another account's pictures
// * [ ] view of followers and friends and stuff
// * [ ] view for metadata -- 'likes'
// * [ ] button to bookmark or like other peoples' posts
// * [ ] navigation -- sticky bar type thing at the top with links & buttons
// * [ ] should check if sbot is already running and use that if possible


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
    effects.getPosts(sbot)
})

