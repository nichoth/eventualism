var { Buffer } = require('buffer')
var S = require('pull-stream')
var xtend = require('xtend')
var ssbMsgs = require('ssb-msgs')
var { Profile } = require('../state')
var types = require('../message-types')
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

        addPendingFile: function (file) {
            var { pendingFiles } = state.newPost
            pendingFiles.set(pendingFiles().concat([file]))
        },

        rmPendingFiles: function () {
            state.newPost.pendingFiles.set([])
        },

        getPosts: function (sbot) {
            S(
                sbot.messagesByType({
                    type: types.post,
                    reverse: true,
                    limit: 10
                }),

                S.asyncMap(function (msg, cb) {
                    if (!isPost(msg)) return cb(null, msg)
                    getBlobFromMessage(sbot, msg, function (err, buf) {
                        if (err) return cb(null)
                        msg.value.content.fileBlob = buf
                        cb(null, msg)
                    })
                }),

                // we're filtering messages that have a bad link value for
                // the image blob.
                // @TODO should probably reject these messages from being
                // written to the database (or indexed in the db view)
                // doing it this way messes up the db query because it
                // doesn't return the `limit` we pass in
                S.filter(Boolean),

                S.collect(function (err, msgs) {
                    if (err) return console.log('err', err)
                    console.log('msgs', msgs)
                    state.messages.data.set(msgs)
                })
            )
        },

        updateProfile: function (sbot, { imageData, file, username }) {
            var id = state.whoami.data().id
            if (id) return _updateProfile({ id })

            sbot.whoami(function (err, res) {
                if (err) return state.whoami.error.set(err)
                state.whoami.data.set(res)
                _updateProfile({ id })
            })

            function _updateProfile ({ id }) {
                sbot.evt.saveBlob(file.toString('base64'),
                    function (err, fileId) {
                        if (err) return console.log('err', err)

                        sbot.publish({
                            type: 'about',
                            about: id,
                            image: xtend(imageData, {
                                link: fileId
                            })
                        }, function (err, res) {
                            console.log('here', err, res)
                            Profile.clearChanges(state.profile)
                        })
                    })

            }

            // sbot.evt.publishPost({
            //     file: file.toString('base64'),
            //     description
            // }, function (err, res) {
            //     // @TODO update app state
            //     if (cb) cb(err, res)
            // })
        },

        getProfile: function (sbot, id) {
            S(
                sbot.links({
                    source: id,
                    dest: id,
                    rel: 'about',
                    values: true,
                    reverse: true
                }),
                S.collect(function (err, res) {
                    if (err) return state.profile.error.set(err)
                    console.log('collect', err, res)
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
    if (!isLink) return cb(new Error('This is not a blob link ' + fileData))
    var { link } = ssbMsgs.link(fileData)

    S(
        sbot.blobs.get(link),
        S.collect(function (err, bufs) {
            if (err) return cb(err)
            cb(null, Buffer.concat(bufs))
        })
    )
}

