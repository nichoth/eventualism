var Router = require('ruta3')
var Home = require('../view/routes/home')

function GetView () {
    var router = Router()

    router.addRoute('/', Home)
    router.addRoute('/new', require('../view/routes/new'))
    router.addRoute('/me', require('../view/routes/me'))
    router.addRoute('/post/:key', require('../view/routes/post'))

    return function getView (pathname) {
        var match = router.match(pathname)
        if (!match) throw new Error('route miss: ' + pathname)
        return match.action(match)
    }
}

module.exports = GetView

