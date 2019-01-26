var { h, Component } = require('preact')
var dragDrop = require('drag-drop/buffer')
var { BufferImage } = require('../components')
var evs = require('../../EVENTS').post

class NewPost extends Component {
    constructor (props) {
        super(props)
    }

    componentDidMount () {
        var { emit } = this.props
        this._unsubscribe = dragDrop('#content', emit(evs.fileDropped))
    }

    componentWillUnmount () {
        this._unsubscribe()
    }

    // @TODO
    // * [ ] show preview image after you select a file
    //
    //    _________
    //   [         ]  | Words go here
    //   | picture |  |
    //   |         |  |
    //    ---------
    //

    render (props) {
        var { pendingFiles } = props

        return <div class="new-post">
            {props.pendingFiles.length ?
                <div class="pending-file-preview">
                    <BufferImage buffer={pendingFiles[0]} />
                </div> :
                null
            }
            <FileInput emit={props.emit} />
        </div>
    }
}

function NewPostRoute (match) {
    return NewPost
}

module.exports = NewPostRoute


// emit
class FileInput extends Component {
    constructor (props) {
        super(props)
    }

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
                onInput={emit(evs.fileAdded)}
            >
                <div className="form-group">
                    <input type="file" name="file" multiple />
                </div>

                <div className="form-group">
                    <textarea name="description" cols="30" rows="10" />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    }
}

