var http = require('http')
var ws = require('pull-ws/server')
var startSSB = require('./start-ssb')

// if we are running this as CLI, not as a module
if (require.main === module) start()

function start () {
    var server = http.createServer(function onRequest (req, res) {

    }).listen(8000)

    var sbot = startSSB()
    console.log(typeof sbot.createStream)

    ws({ server }, function (wsStream) {
    })
}

module.exports = start

