var { h } = require('preact')
var { combineClasses } = require('../util')
var { isPost } = require('../../lib')

module.exports = {
    PostMedia,
    BufferImage,
    BgImage,
    FormGroup,
    FormControls,
    Button
}

function Button (props) {
    return <button {...props}
        class={combineClasses('evt-btn', props.class)}
    >
        {props.children}
    </button>
}

function FormControls (props) {
    return <div class="form-controls">
        {props.children}
    </div>
}

function FormGroup (props) {
    return <div className="form-group">
        {props.children}
    </div>
}

function BgImage (props) {
    return <div className="bg-image" style={{
        backgroundImage: 'url(' + props.src + ')'
    }}>
        {props.children}
    </div>
}

function BufferImage ({ buffer, href, alt }) {
    var blob = new window.Blob([buffer], {
        type: 'image/jpeg'
    })
    var imgUrl = window.URL.createObjectURL(blob)

    return <div class="buffer-image">
        {href ?
            <a href={href}>
                <img src={imgUrl} alt={alt} />
            </a> :
            <img src={imgUrl} alt={alt} />
        }
    </div>
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




