var { h } = require('preact')
var evs = require('../../EVENTS').hello

function Home (match) {
    return function HomeView (props) {
        return <div>
            home route... hello {props.hello}

            <form onSubmit={props.emit(evs.world)}>
                <input type="text" name="example" />
                <button>Click</button>
            </form>

            <div>
                <pre>
                    <code>
                        {JSON.stringify(props, null, 2)}
                    </code>
                </pre>
            </div>
        </div>
    }
}

module.exports = Home

