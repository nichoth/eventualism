// var toPull = require('stream-to-pull-stream')
// var toStream = require('filereader-stream')
var { Buffer } = require('buffer')
var S = require('pull-stream')
var fileReaderStream = require('pull-file-reader')
var evs = require('../EVENTS')
var { post } = evs

function subscribeToView ({ sbot, effects, view }) {
    view.on(post.submitNewPost, function (ev) {
        preventDefault(ev)
        console.log('submit new post', ev)

        // var data = new window.FormData(ev.target)
        // console.log('form data', data)

        // effects.publishPost(sbot, data, function (err, res) {
        //     console.log('eeeeee', err, res)
        // })

        var files = ev.target.file.files
        console.log('files', files)
        var description = ev.target.elements.description.value

        S( fileReaderStream(files[0]), S.collect(function (err, bufs) {
            if (err) return console.log('err', err)

            var post = {
                // this creates a pull stream source from the file object
                file: Buffer.concat(bufs),
                description
            }

            effects.publishPost(sbot, post, function (err, res) {
                console.log('wooooo publish', err, res)
            })
        }) )

        // var post = {
        //     // this creates a pull stream source from the file object
        //     file: fileReaderStream(files[0]),
        //     description
        // }

        // console.log('post', post)
        // effects.publishPost(sbot, post, function (err, res) {
        //     console.log('wooooo publish', err, res)
        // })
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

