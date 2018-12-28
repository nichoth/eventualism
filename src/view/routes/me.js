var { h, Component } = require('preact')

class Profile extends Component {
    constructor (props) {
        super(props)
    }

    render (props) {
        return <div class="route-profile">
            todo profile page
        </div>
    }
}

function ProfileRoute (match) {
    return Profile
}

module.exports = ProfileRoute

