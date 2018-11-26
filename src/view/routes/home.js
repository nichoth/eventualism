var { h } = require('preact')
var { isPost } = require('../../lib')

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

                        <PostMedia msg={msg} />
                    </div>
                })}
            </div>
        </div>
    }
}

function PostMedia ({ msg }) {
    if (!isPost(msg)) return null
    var { description, fileBlob } = msg.value.content
    var blob = new window.Blob([fileBlob.buffer], {
        type: 'image/jpeg'
    })
    var imgUrl = window.URL.createObjectURL(blob)

    return <div class="post-media">
        <img src={imgUrl} alt={description} />
    </div>
}

module.exports = Home

