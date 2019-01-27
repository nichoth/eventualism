var { h, Component } = require('preact')
var dragDrop = require('drag-drop/buffer')
var { BufferImage, FormGroup, FormControls } = require('../components')
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
            <FileInput emit={props.emit} disabled={!pendingFiles.length}
                {...props} />
        </div>
    }
}

function NewPostRoute (match) {
    return NewPost
}

module.exports = NewPostRoute


class FileInput extends Component {
    constructor (props) {
        super(props)
    }

    render (props) {
        var { emit, pendingFiles } = props

        return <div class="evt-file-input" id="evt-file-input">
            {props.pendingFiles.length ?
                <div class="pending-file-preview">
                    <BufferImage buffer={pendingFiles[0]} />
                </div> :
                <div class="pending-file-placeholder" />
            }

            <form enctype="multipart/form-data" method="post"
                onSubmit={emit(evs.submitNewPost)}
            >
                <FormGroup>
                    <input type="file" name="file" multiple
                        onInput={emit(evs.fileAdded)} />
                </FormGroup>

                <FormGroup>
                    <textarea className="post-caption-input"
                        name="description"
                        onInput={emit(evs.captionChange)} />
                </FormGroup>

                <FormControls>
                    <button disabled={props.disabled}
                        onClick={emit(evs.resetForm)}
                    >
                        Cancel
                    </button>

                    <button type="submit" disabled={props.disabled}>
                        Create post
                    </button>
                </FormControls>

            </form>
        </div>
    }
}



