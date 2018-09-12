var Router = require('ruta3')
var Home = require('../view/routes/home')

function GetView () {
    var router = Router()

    router.addRoute('/', Home)

    return function getView (pathname) {
        var match = router.match(pathname)
        if (!match) throw new Error('route miss: ' + pathname)
        return match.action(match)
    }
}

module.exports = GetView

