var Routes = require('ruta3')

function RouteEffects ({ state }) {
    var router = Routes()

    router.addRoute('/post/:key', function ({ params }) {
        var msgs = state.messages.data()
        var msg
        var l = msgs.length
        while (l--) {
            if (msgs[l].key === params.key) {
                msg = msgs[l]
                break
            }
        }

        if (!msg) {
            // @TODO call sbot to get the message by key
        }

        state.postDetail.message.set(msg)
    })

    return function routeEffects ({ pathname }) {
        var match = router.match(pathname)
        if (!match) return
        match.action(match)
    }
}

module.exports = RouteEffects

