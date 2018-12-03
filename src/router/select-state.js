var Routes = require('ruta3')

function SelectState () {
    var router = Routes()

    router.addRoute('/', function (state, match) {
        return {
            messages: state.messages
        }
    })

    router.addRoute('/new', state => state.newPost)
    router.addRoute('/post/:key', state => state.postDetail)

    return function selectState (state, pathname) {
        var match = router.match(pathname)
        if (!match) return null
        var _state = match.action(state, match)
        return _state
    }
}

module.exports = SelectState

