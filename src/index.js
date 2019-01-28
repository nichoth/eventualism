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
// * [ ] route to view your profile
// * [ ] button and api method to 'follow' someone
// * [ ] button to 'like' a post
// * [ ] test that gossip is ok
// * [ ] e2e test with cypress
// * [ ] show visual feedback when you submit the form for new posts
// * [ ] post/:key route -- need to ask sbot for the image if it's not in
//          memory
// * [ ] live updates from the message feed, where we get the initial list.
//      This should probably have a 'notification' type of thing with
//      a button to show new posts, like in patchwork
// * [ ] route to see another account's pictures. There are two ways for
//       this -- use the user's public key as the route path, or use their
//       assigned alias as the path. In the second case, we would want to
//       be able to name them, too, like the contacts in a phone. Or could
//       show a GUI with navigation to all users with that alias, then the
//       links would be the name + index in the nav list
// * [ ] view of followers and friends and stuff
// * [ ] view for metadata -- 'likes'
// * [ ] button to bookmark or like other peoples' posts
// * [ ] navigation -- sticky bar type thing at the top with links & buttons
// * [ ] should check if sbot is already running and use that if possible
// * [x] preview of image file


var state = createState()
var effects = Effects({ state })
var routeEffects = RouteEffects({ state, effects, getSbot })
var bus = Bus({ memo: true })
catchRoutes(parsedUrl => {
    state.route.set(parsedUrl)
    routeEffects(parsedUrl)
})

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

var _bus = Bus()
var _sbotErr
var _sbot
function getSbot (cb) {
    if (_sbotErr) return cb(_sbotErr)
    if (_sbot) return cb(null, _sbot)
    _bus.once('connect', function ([err, sbot]) {
        cb(err, sbot)
    })
}

effects.connectSbot(function (err, sbot) {
    if (err) {
        _sbotErr = err
        _bus.emit('connect', [err])
        return
    }
    if (process.env.NODE_ENV === 'development') window.sbot = sbot
    _sbot = sbot
    _bus.emit('connect', [null, sbot])

    subscribeToView({ sbot, effects, view: bus, state })
    effects.getPosts(sbot)
})



