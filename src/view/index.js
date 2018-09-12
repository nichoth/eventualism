var { h } = require('preact')
var router = require('../router')

function App (props) {
    if (process.env.NODE_ENV === 'development') {
        console.log('render', props)
    }

    var { emit } = props
    var RouteView = props.route.pathname ?
        router.getView(props.route.pathname) :
        null

    var routeState = props.route.pathname ?
        router.selectState(props, props.route.pathname) :
        null

    return <div>
        view/index

        <hr />

        <div className="app-content">
            <RouteView {...routeState} emit={emit} />
        </div>
    </div>
}

module.exports = App

