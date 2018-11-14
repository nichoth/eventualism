var { h, Component } = require('preact')
// var Dash = require('@uppy/dashboard')
var Uppy = require('@uppy/core')
var _FileInput = require('@uppy/file-input')
// var XHRUpload = require('@uppy/xhr-upload')
var evs = require('../EVENTS').post

// emit
class FileInput extends Component {
    constructor (props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit (ev) {
        ev.preventDefault()
        console.log('submit', ev)
        var files = ev.target.file.files
        console.log('files', files)
    }

    shouldComponentUpdate () {
        return false
    }

    componentDidMount () {
        var el = document.getElementById('evt-file-input')

        var uppy = Uppy({
            // debug: true,
            // onBeforeFileAdded: function () {
            //     console.log('here', arguments)
            // }
        })

        uppy.on('file-added', this.props.emit(evs.addFile))

        uppy.use(_FileInput, {
            target: el,
            pretty: true,
            inputName: 'file',
            replaceTargetContent: true
        })
    }

    render (props) {
        console.log('fileInput render', props)

        return <div class="evt-file-input" id="evt-file-input">
            <form onSubmit={this.onSubmit}>
                <input type="file" name="file" id="foo" multiple />
                <button type="submit">Submit</button>
            </form>
        </div>
    }
}

module.exports = FileInput

