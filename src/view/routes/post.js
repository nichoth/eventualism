var { h } = require('preact')
var { PostMedia } = require('../components')

function PostRoute ({ params }) {
    return PostRouteView
}

function PostRouteView (props) {
    console.log('post detail render', props)
    var { message } = props

    return <div className="route-post">
        post view

        <PostMedia msg={message} />
    </div>
}

module.exports = PostRoute

