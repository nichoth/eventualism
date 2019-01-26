var { Buffer } = require('buffer')
var S = require('pull-stream')
var fileReaderStream = require('pull-file-reader')
var { post } = require('../EVENTS')

function subscribeToView ({ sbot, effects, view }) {
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

    view.on(post.submitNewPost, function (ev) {
        preventDefault(ev)
        console.log('submit new post', ev)

        var files = ev.target.file.files
        console.log('files', files)
        var description = ev.target.elements.description.value

        S( fileReaderStream(files[0]), S.collect(function (err, bufs) {
            // @TODO set state here for the error
            if (err) return console.log('err', err)

            var post = {
                file: Buffer.concat(bufs),
                description
            }

            effects.publishPost(sbot, post, function (err, res) {
                // don't need to do anything here. state is set in effects
                console.log('wooooo publish', err, res)
            })
        }) )
    })
}

function preventDefault (ev) {
    try {
        ev.preventDefault()
    } catch (err) {
        // ok
    }
}

module.exports = subscribeToView

