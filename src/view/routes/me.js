var { h } = require('preact')
var { FormGroup, FormControls, Button, Input,
    BufferImage } = require('../components')
var { PureComponent } = require('../util')
var evs = require('../../EVENTS').profile

class Profile extends PureComponent {
    constructor (props) {
        super(props)
    }

    render (props) {
        var { emit } = props

        return <div class="route-profile">
            <form onSubmit={emit(evs.submit)}>
                <FormGroup>
                    <label for="usernmae">Name</label>
                    <Input name="username" />
                </FormGroup>

                <FormGroup>
                    <ImageInput onInput={emit(evs.selectAvatar)}
                        name="avatar" />
                </FormGroup>

                <FormControls>
                    <Button>Reset</Button>
                    <Button type="submit">Save</Button>
                </FormControls>

            </form>
        </div>
    }
}

class ImageInput extends PureComponent {
    constructor (props) {
        super(props)
        this.state = {
            selectedImage: null
        }
        this.onInput = this.onInput.bind(this)
    }

    onInput (ev) {
        var { props } = this
        this.setState({ selectedImage: ev.target.files[0] })
        if (props.onInput) props.onInput(ev.target.files[0])
    }

    render (props, state) {
        return <div class="evt-image-input">
            {state.selectedImage ?
                <div class="pending-file-preview">
                    <BufferImage buffer={state.selectedImage} />
                </div> :
                <div class="pending-file-placeholder" />
            }

            <FormGroup>
                <input type="file" name={props.name || 'file'} multiple
                    onInput={this.onInput} />
            </FormGroup>
        </div>
    }
}


function ProfileRoute (match) {
    return Profile
}

module.exports = ProfileRoute

