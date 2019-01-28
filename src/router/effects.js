var Routes = require('ruta3')

function RouteEffects ({ state, effects, getSbot }) {
    var router = Routes()

    router.addRoute('/me', function ({ params }) {
        getSbot(function (err, sbot) {
            if (err) throw err
            var id = state.whoami.data().id
            if (id) return effects.getProfile(sbot, id)
            sbot.whoami(function (err, res) {
                if (err) return state.whoami.error.set(err)
                state.whoami.data.set(res)
                effects.getProfile(sbot, res.id)
            })
        })
    })

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

