var fileReader = require('pull-file-reader')
var evs = require('../EVENTS')

function subscribeToView ({ effects, view }) {
    view.on(evs.hello.world, effects.onClick)

    view.on(evs.post.addFile, function (ev) {
        console.log('woooooo', ev)
        var file = ev.data

        // this creates a pull stream source from the file object
        effects.publishPost({
            file: fileReader(file),
            description: 'foo'
        })
    })
}

module.exports = subscribeToView

