var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    post: ['fileAdded', 'fileDropped', 'captionChange', 'submitNewPost']
})

module.exports = EVENTS

