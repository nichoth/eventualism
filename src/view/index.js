var { h } = require('preact')
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

            <nav>
                <a href="/">Home</a>
                <a href="/new">New</a>
            </nav>

            <hr />

            <RouteView {...routeState} emit={emit} />
        </div>
    </div>
}

function Connection (props) {
    return <div className="evt-connection-state">
        <pre>
            {JSON.stringify(props.sbotConnection, null, 2)}
        </pre>
    </div>
}

module.exports = App

