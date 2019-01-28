var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    post: ['fileAdded', 'fileDropped', 'captionChange', 'submitNewPost',
        'resetForm'],

    profile: ['submit', 'selectAvatar']
})

module.exports = EVENTS

