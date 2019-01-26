var { struct, observ } = require('./lib')

function createState () {
    var state = struct({
        route: struct({}),

        sbotConnection: struct({
            isResolving: observ(false),
            error: observ(null),
            isConnected: observ(false)
        }),

        messages: struct({
            data: observ([])
        }),

        postDetail: struct({
            message: struct({})
        }),

        newPost: struct({
            pendingFiles: observ([])
        })
    })

    return state
}

module.exports = {
    createState
}

