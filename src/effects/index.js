var S = require('pull-stream')
var _connectSbot = require('./connect-sbot')
function noop () {}

function Effects ({ state }) {
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
                    return sbotConnection.error.set(true)
                }

                console.log('got ws sbot')
                sbotConnection.isConnected.set(true)
                cb(null, sbot)
            })
        },

        publishPost: function (sbot, post, cb) {
            var { file, description } = post

            sbot.evt.publishPost({
                file: file.toString(),
                description
            }, function (err, res) {
                console.log('in here', err, res)
                // @TODO update state
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
                    console.log('msgs', msgs)
                    state.messages.data.set(msgs)
                })
            )
        }
    }

    return effects
}

module.exports = Effects

