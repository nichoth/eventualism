var { h } = require('preact')
var { PostMedia } = require('../components')

function Home (match) {
    return HomeView
}

function HomeView (props) {
    var { messages } = props

    // @TODO
    // a button you click to 'like' things

    return <div className="evt-route-home">
        <div class="main-feed">
            {messages.data.map(function (msg, i) {
                return <div class="evt-message" key={i}>
                    <PostMedia msg={msg} href={'/post/' +
                        window.encodeURIComponent(msg.key)} />
                </div>
            })}
        </div>
    </div>
}

module.exports = Home

