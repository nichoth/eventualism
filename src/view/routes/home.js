var { h } = require('preact')
var { isPost } = require('../../lib')
// var evs = require('../../EVENTS').hello

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
    // var imgUrl = 'data:image/jpg;base64,' + fileBlob
    // var imgUrl = fileBlob
    var blob = new window.Blob([fileBlob], {
        type: 'image/jpeg'
    })
    var imgUrl = (window.URL || window.webkitURL).createObjectURL(blob)

    return <div class="post-media">
        <img src={imgUrl} alt={description} />
    </div>
}

module.exports = Home

