var Routes = require('ruta3')

function SelectState () {
    var router = Routes()

    router.addRoute('/', function (state, match) {
        return state.homeRoute
    })

    return function selectState (state, pathname) {
        var match = router.match(pathname)
        if (!match) return null
        var _state = match.action(state, match)
        return _state
    }
}

module.exports = SelectState

