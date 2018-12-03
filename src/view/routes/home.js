var { h } = require('preact')
var { PostMedia } = require('../components')

function Home (match) {
    return function HomeView (props) {
        var { messages } = props

        return <div className="evt-route-home">
            <div class="main-feed">
                {messages.data.map(function (msg, i) {
                    return <div class="evt-message" key={i}>
                        <div>
                            {msg.value.content.type}
                        </div>

                        <PostMedia msg={msg} href={'/post/' +
                            window.encodeURIComponent(msg.key)} />
                    </div>
                })}
            </div>
        </div>
    }
}

module.exports = Home

