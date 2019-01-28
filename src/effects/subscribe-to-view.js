var { Buffer } = require('buffer')
var S = require('pull-stream')
var fileReaderStream = require('pull-file-reader')
var { post, profile } = require('../EVENTS')

function subscribeToView ({ sbot, effects, view, state }) {

    // new post
    view
        .on(post.fileAdded, function (ev) {
            console.log('fileAdded', ev)
            effects.addPendingFile(ev.target.files[0])
        })
        .on(post.fileDropped, function (files) {
            effects.addPendingFile(files[0])
        })
        .on(post.captionChange, function (ev) {
            // console.log('caption change')
            // i guess we don't need this right now
        })
        .on(post.resetForm, function (ev) {
            ev.preventDefault()
            effects.rmPendingFiles()
        })

        .on(post.submitNewPost, function (ev) {
            preventDefault(ev)
            var files = ev.target.file.files
            var description = ev.target.elements.description.value

            readFile(files[0], function (err, file) {
                if (err) return console.warn('err', err)
                var post = { file, description }

                effects.publishPost(sbot, post, function (err, res) {
                    // don't need to do anything here. state is set in
                    // effects
                    console.log('wooooo publish', err, res)
                })
            })
        })

    // profile
    view
        .on(profile.submit, function (ev) {
            ev.preventDefault()
            console.log('submit', ev)
            var file = ev.target.elements.avatar.files[0]
            var username = ev.target.elements.username.value
            console.log('submit profile', file, username)

            var url = window.URL.createObjectURL(file)
            var img = new window.Image()
            img.onload = function () {
                var imageData = {
                    size: file.size,
                    type: file.type,
                    name: file.name,
                    width: img.width,
                    height: img.height
                }

                readFile(file, function (err, buf) {
                    if (err) return console.warn('err', err)
                    effects.updateProfile(sbot, {
                        file: buf,
                        imageData,
                        username
                    })
                })
            }

            img.src = url
        })

        .on(profile.selectAvatar, function (file) {
            console.log('selectAvatar', file)
            var { profile } = state

            profile.pendingChanges.image.set({
                size: file.size,
                type: file.type,
                name: file.name
            })
        })

}

function preventDefault (ev) {
    try {
        ev.preventDefault()
    } catch (err) {
        // ok
    }
}

function readFile (file, cb) {
    S(
        fileReaderStream(file),
        S.collect(function (err, bufs) {
            if (err) return cb(err)
            cb(null, Buffer.concat(bufs))
        })
    )
}

module.exports = subscribeToView

