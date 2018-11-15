require('dotenv').config()
var http = require('http')
var S = require('pull-stream')
var muxrpc = require('muxrpc')
var ws = require('pull-ws/server')
var manifest = require('../manifest.json')
var startSSB = require('./start-ssb')

// if we are running this as CLI, not as a module
if (require.main === module) start()

function start () {
    var sbot = startSSB()

    var server = http.createServer(function onRequest (req, res) {
        console.log('got request')
    }).listen(8000, function (err) {
        if (err) throw err
        console.log('listening on 8000')
    })

    sbot.evt = {
        publishPost: function (post, cb) {
            var { file, description } = post

            S(
                S.once(Buffer.from(file)),
                sbot.blobs.add(onBlobAdded)
            )

            function onBlobAdded (err, fileId) {
                console.log('blob added', arguments)
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

    ws({ server }, function onConnection (wsStream) {
        console.log('got ws connection')

        // arguments are (remote, local)
        var rpcServer = muxrpc(null, manifest)(sbot)
        var rpcServerStream = rpcServer.createStream(function onEnd (err) {
            console.log('rpc stream close', err)
        })

        S(wsStream, rpcServerStream, wsStream)
    })

    return { server, sbot }
}

module.exports = start

