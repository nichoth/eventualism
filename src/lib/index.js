var messages = {
    post: function ({ description, fileId }) {
        return {
            type: 'eventualism/post',
            description,
            fileId
        }
    }
}

module.exports = {
    observ: require('@nichoth/observ/observ'),
    struct: require('@nichoth/observ/struct'),
    Model: require('@nichoth/observ/model'),
    messages,
    isPost
}

function isPost (msg) {
    var _isPost
    try {
        _isPost = msg.value.content.type === 'evt/post'
    } catch (err) {
        _isPost = false
    }
    return _isPost
}
