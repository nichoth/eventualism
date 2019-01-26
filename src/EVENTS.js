var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    post: ['fileAdded', 'fileDropped', 'submitNewPost']
})

module.exports = EVENTS

