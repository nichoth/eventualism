// var test = require('tape')
var S = require('pull-stream')
var fs = require('fs')
var toPull = require('stream-to-pull-stream')
var muxrpc = require('muxrpc')
var manifest = require('../manifest.json')
var { createState } = require('../src/state')
var Effects = require('../src/effects')

module.exports = function ({ sbot, test }) {
    test('rpc sbot', function (t) {
        t.plan(4)
        var state = createState()
        var effects = Effects({ state })

        var filePath = __dirname + '/iguana.jpg'
        var msg = {
            file: toPull.source(fs.createReadStream(filePath)),
            description: 'hello world'
        }

        var rpcClient = muxrpc(manifest, null)()
        var rpcClientStream = rpcClient.createStream(function _onClose (err) {
            console.log('client close', err, arguments)
        })

        // arguments are (remote, local)
        var rpcServer = muxrpc(null, manifest)(sbot)
        var rpcServerStream = rpcServer.createStream(function onEnd (err) {
            console.log('rpc stream close', err)
        })

        S(rpcClientStream, rpcServerStream, rpcClientStream)

        effects.publishPost(rpcClient, msg, function (err, res) {
            t.error(err)
            t.deepEqual(res.value.content.description, msg.description)
            t.equal(res.value.content.type, 'evt/post')
            t.ok(res.value.content.fileData, 'should have fileId')
        })
    })

}

