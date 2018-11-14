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
    var server = http.createServer(function onRequest (req, res) {
        console.log('got request')
    }).listen(8000, function (err) {
        if (err) throw err
        console.log('listening on 8000')
    })

    var sbot = startSSB()

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

