var { h } = require('preact')
// var evs = require('../../EVENTS').hello

function Home (match) {
    return function HomeView (props) {
        var { messages } = props

        return <div className="evt-route-home">
            <div class="main-feed">
                {messages.data.map(function (msg, i) {
                    return <div class="evt-message" key={i}>
                        {msg.value.content.type}
                    </div>
                })}
            </div>
        </div>
    }
}

module.exports = Home

