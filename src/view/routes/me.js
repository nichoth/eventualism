var { h, Component } = require('preact')
var { FormGroup, FormControls, Button } = require('../components')
var u = require('../util')
var evs = require('../../EVENTS').profile

class Profile extends Component {
    constructor (props) {
        super(props)
    }

    render (props) {
        var { emit } = props

        // @TODO
        // image input for avatar

        return <div class="route-profile">
            profile page

            <form onSubmit={emit(evs.submit)}>
                <FormGroup>
                    <label for="usernmae">Name</label>
                    <Input name="username" />
                </FormGroup>

                <FormControls>
                    <Button>Reset</Button>
                    <Button type="submit">Save</Button>
                </FormControls>

            </form>
        </div>
    }
}

function Input (props) {
    return <input class={u.combineClasses('evt-input', props.class)}
        type="text" {...props} />
}

function ProfileRoute (match) {
    return Profile
}

module.exports = ProfileRoute

