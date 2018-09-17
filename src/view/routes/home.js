var { h } = require('preact')
// var evs = require('../../EVENTS').hello

function Home (match) {
    return function HomeView (props) {
        return <div>
            home route... hello {props.hello}
        </div>
    }
}

module.exports = Home

