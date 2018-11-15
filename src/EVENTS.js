var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    post: ['addFile', 'submitNewPost']
})

module.exports = EVENTS

