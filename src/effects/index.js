var S = require('pull-stream')
// var xtend = require('xtend')
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

        // there's a two step proess of adding the blob and then writing
        // the message that references it. This means that there could
        // be bad state where we have a dangling blob with no post
        publishPost: function (sbot, post, cb) {
            // file should be a source
            cb = cb || noop
            var { file, description } = post

            S(
                file,
                sbot.blobs.add(function onBlobAdded (err, fileId) {
                    if (err) return cb(err)

                    sbot.publish({
                        type: 'evt/post',
                        fileData: fileId,
                        description
                    }, function donePublishing (err, res) {
                        if (err) {
                            // @TODO can we delete the blob if this
                            // fails? I guess that's naive. We would
                            // want some kind of disk persisted store
                            // of pending posts, so that we can do
                            // atomic publishes
                            return cb(err)
                        }

                        cb(null, res)
                    })
                })
            )
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

