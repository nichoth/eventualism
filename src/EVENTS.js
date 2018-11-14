var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    hello: ['world'],
    post: ['addFile']
})

module.exports = EVENTS

