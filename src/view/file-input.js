var { h, Component } = require('preact')
// var Uppy = require('@uppy/core')
// var Dashboard = require('@uppy/dashboard')
// var ThumbnailGenerator = require('@uppy/thumbnail-generator')
// var UppyFileInput = require('@uppy/file-input')
// var XHRUpload = require('@uppy/xhr-upload')
var evs = require('../EVENTS').post

// emit
class FileInput extends Component {
    constructor (props) {
        super(props)
        // this.onSubmit = this.onSubmit.bind(this)
    }

    // onSubmit (ev) {
    //     ev.preventDefault()
    //     console.log('submit', ev)
    //     var files = ev.target.file.files
    //     console.log('files', files)
    // }

    shouldComponentUpdate () {
        return false
    }

    componentDidMount () {
        // var el = document.getElementById('evt-file-input')

        // var uppy = Uppy({
        //     autoProceed: false,
        //     debug: true,
        //     // onBeforeFileAdded: function () {
        //     //     console.log('here', arguments)
        //     // }
        // })

        // uppy.on('file-added', this.props.emit(evs.addFile))
        // uppy.on('complete', this.props.emit(evs.addFile))

        // dashboard
        // uppy.use(Dashboard, {
        //     inline: true,
        //     target: el,
        //     replaceTargetContent: true,
        //     showProgressDetails: true
        // })

        // uppy.use(UppyFileInput, {
        //     target: el,
        //     pretty: true,
        //     inputName: 'file',
        //     replaceTargetContent: true
        // })

        // uppy.use(ThumbnailGenerator, {
        //     thumbnailWidth: 200
        // })
    }

    render (props) {
        // console.log('fileInput render', props)
        var { emit } = props

        return <div class="evt-file-input" id="evt-file-input">
            <form enctype="multipart/form-data" method="post"
                onSubmit={emit(evs.submitNewPost)}
            >
                <div className="form-group">
                    <input type="file" name="file" id="foo" multiple />
                </div>

                <div className="form-group">
                    <textarea name="description" cols="30" rows="10" />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    }
}

module.exports = FileInput

