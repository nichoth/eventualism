var { h, Component } = require('preact')
var FileInput = require('../file-input')

class New extends Component {
    constructor (props) {
        super(props)
    }

    render (props) {
        return <div class="new-post">
            <FileInput emit={props.emit} />
        </div>
    }
}

function NewPostRoute (match) {
    return New
}

module.exports = NewPostRoute

