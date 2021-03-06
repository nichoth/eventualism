var S = require('pull-stream')
var types = require('../src/message-types')

// add our app methods
function patch (sbot) {
    sbot.evt = {
        saveBlob: function (blob, cb) {
            S(
                S.once(Buffer.from(blob, 'base64')),
                sbot.blobs.add(function (err, fileId) {
                    if (err) return cb(err)
                    cb(null, fileId)
                })
            )
        },

        publishPost: function (post, cb) {
            var { file, description } = post

            S(
                S.once(Buffer.from(file, 'base64')),
                sbot.blobs.add(onBlobAdded)
            )

            function onBlobAdded (err, fileId) {
                if (err) return cb(err)

                sbot.publish({
                    type: types.post,
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

