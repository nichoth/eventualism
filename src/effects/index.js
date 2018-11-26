var { Buffer } = require('buffer')
// var toBuffer = require('typedarray-to-buffer')
var S = require('pull-stream')
var ssbMsgs = require('ssb-msgs')
var { isPost } = require('../lib')
var _connectSbot = require('./connect-sbot')
function noop () {}

function Effects ({ state }) {
    var effects = {
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
            cb = cb || noop
            var { file, description } = post

            sbot.evt.publishPost({
                file: file.toString('base64'),
                description
            }, function (err, res) {
                // @TODO update app state
                if (cb) cb(err, res)
            })
        },

        getMessages: function (sbot) {
            S(
                sbot.createLogStream({
                    reverse: true,
                    limit: 10
                }),

                S.asyncMap(function (msg, cb) {
                    if (!isPost(msg)) return cb(null, msg)
                    getBlobFromMessage(sbot, msg, function (err, buf) {
                        if (err) return cb(err)
                        msg.value.content.fileBlob = buf
                        // msg.value.content.fileBlob = buf.toString('base64')
                        cb(null, msg)
                    })
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
module.exports.getBlobFromMessage = getBlobFromMessage

function getBlobFromMessage (sbot, msg, cb) {
    var { fileData } = msg.value.content
    var isLink = ssbMsgs.isLink(fileData, 'blob')
    if (!isLink) return cb(new Error('This is not a link'))
    var { link } = ssbMsgs.link(fileData)

    S(
        sbot.blobs.get(link),
        S.collect(function (err, bufs) {
            if (err) return cb(err)
            // console.log('aaaaaa', bufs)
            // console.log('here', Buffer.concat(bufs))
            // console.log('foo blab', toBuffer(Buffer.concat(bufs)))
            // console.log(Buffer.concat(bufs).toString('base64'))
            // console.log(Buffer.concat(bufs).toString())
            cb(null, Buffer.concat(bufs))
        })
    )
}








