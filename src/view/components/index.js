var { h } = require('preact')
var { isPost } = require('../../lib')

module.exports = {
    PostMedia
}

function PostMedia ({ msg, href }) {
    if (!isPost(msg)) return null
    var { description, fileBlob } = msg.value.content
    var blob = new window.Blob([fileBlob.buffer], {
        type: 'image/jpeg'
    })
    var imgUrl = window.URL.createObjectURL(blob)


    return <div class="post-media">
        {href ?
            <a href={href}>
                <img src={imgUrl} alt={description} />
            </a> :
            <img src={imgUrl} alt={description} />
        }
    </div>
}


