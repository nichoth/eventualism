var { Component } = require('preact')

class PureComponent extends Component {
    shouldComponentUpdate (nextProps, nextState) {
        return !(shallowEqual(nextProps, this.props) &&
            shallowEqual(nextState, this.state))
    }
}

function shallowEqual(a, b) {
    for (let key in a) if (a[key]!==b[key]) return false
    for (let key in b) if (!(key in a)) return false
    return true
}

module.exports = {
    combineClasses: function combineClasses (a, b) {
        return [a].concat((b || '').split(' ').filter(Boolean)).join(' ')
            .trim()
    },

    pureShouldUpdate,
    PureComponent
}

function pureShouldUpdate (nextProps, props) {
    for (var k in nextProps) {
        if (nextProps[k] !== props[k]) return true
    }
    for (var k in props) {
        if (!(k in nextProps)) return true
    }
    return false
}

