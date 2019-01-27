var { h } = require('preact')
var { PureComponent } = require('./util')
var router = require('../router')

function App (props) {
    if (process.env.NODE_ENV === 'development') {
        console.log('render', props)
    }

    var { emit, route } = props
    var RouteView = route.pathname ?
        router.getView(route.pathname) :
        null

    var routeState = route.pathname ?
        router.selectState(props, route.pathname) :
        null

    return <div id="app-root">
        <div className="app-content">
            <Connection {...props} />

            <AppNav route={props.route} />


            <hr />

            <RouteView {...routeState} emit={emit} />
        </div>
    </div>
}

var navs = [
    ['/', 'Home'],
    ['/new', 'New'],
    ['/me', 'Profile']
]

class AppNav extends PureComponent {
    render (props) {
        var { route } = props
        var _path
        try {
            _path = route.pathname.split('/').filter(Boolean)
        } catch (err) {
            // ok
        }

        return <nav class="evt-main-nav">
            {navs.map(function (nav, i) {
                var isActive = _path ?
                    _path[0] === (nav[0].split('/').filter(Boolean)[0]) :
                    false
                var _props = { href: nav[0] }
                if (isActive) _props.class = 'active'
                return <a {..._props} key={i}>{nav[1]}</a>
            })}
        </nav>
    }
}

function Connection (props) {
    return <div className="evt-connection-state">
        <pre>
            {JSON.stringify(props.sbotConnection, null, 2)}
        </pre>
    </div>
}

module.exports = App

