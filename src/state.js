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
        }),

        profile: Profile(),

        whoami: struct({
            error: observ(null),
            data: struct({})
        })
    })

    return state
}

function Profile () {
    return struct({
        error: observ(null),
        data: struct({}),
        pendingChanges: struct({
            image: struct({}),
            username: observ(null)
        })
    })
}

Profile.clearChanges = function (state) {
    state.pendingChanges.image.set({})
    state.pendingChanges.username.set(null)
}

module.exports = {
    createState,
    Profile
}

