var S = require('pull-stream')

// add our app methods
function patch (sbot) {
    sbot.evt = {
        publishPost: function (post, cb) {
            var { file, description } = post

            S(
                S.once(Buffer.from(file, 'base64')),
                sbot.blobs.add(onBlobAdded)
            )

            function onBlobAdded (err, fileId) {
                if (err) return cb(err)

                sbot.publish({
                    type: 'evt/post',
                    fileData: fileId,
                    description
                }, function donePublishing (err, res) {
                    if (err) {
                        // @TODO can we delete the blob if this
                        // fails? I guess that's naive. We would
                        // want some kind of disk persisted store
                        // of pending posts, so that we can do
                        // atomic publishes
                        return cb(err)
                    }

                    cb(null, res)
                })
            }
        }
    }

    return sbot
}

module.exports = patch

