var S = require('pull-stream')
var catchRoutes = require('@nichoth/catch-routes')
var _connectSbot = require('../connect-sbot')
var evs = require('../EVENTS')
function noop () {}

function Effects ({ state, view }) {
    catchRoutes(parsedUrl => state.route.set(parsedUrl))

    var effects = {
        onClick: function (ev) {
            ev.preventDefault()
            console.log('click', ev)
            var example = ev.target.elements.example
            state.homeRoute.hello.set(example.value)
        },

        connectSbot: function (cb) {
            cb = cb || noop
            var { sbotConnection } = state
            sbotConnection.isResolving.set(true)

            _connectSbot({
                onClose: function (err) {
                    console.log('rpc close', err)
                    if (err) sbotConnection.error.set(err)
                    sbotConnection.isConnected.set(false)
                }
            }, function onConnect (err, sbot) {
                sbotConnection.isResolving.set(false)
                if (err) {
                    cb(err)
                    return sbotConnection.error.set(err)
                }

                console.log('got ws sbot')
                sbotConnection.isConnected.set(true)
                cb(null, sbot)
            })
        },

        getMessages: function (sbot) {
            S(
                sbot.createLogStream({
                    reverse: true,
                    limit: 10
                }),
                S.collect(function (err, msgs) {
                    if (err) return console.log('err', err)
                    state.messages.data.set(msgs)
                })
            )
        }

    }

    // listen for DOM events
    view.on(evs.hello.world, effects.onClick)

    return effects
}

module.exports = Effects

