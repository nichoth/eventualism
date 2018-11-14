var test = require('tape')
var Sbot = require('scuttle-testbot')
    .use(require('ssb-blobs'))
var fs = require('fs')
var toPull = require('stream-to-pull-stream')
var { createState } = require('../src/state')
var Effects = require('../src/effects')

test('Publish a message', function (t) {
    t.plan(4)
    var sbot = Sbot()
    var state = createState()
    var effects = Effects({ state })

    var filePath = __dirname + '/iguana.jpg'
    var msg = {
        file: toPull.source(fs.createReadStream(filePath)),
        description: 'hello world'
    }

    effects.publishPost(sbot, msg, function (err, res) {
        t.error(err)
        t.deepEqual(res.value.content.description, msg.description)
        t.ok(res.value.content.fileData)
        t.equal(res.value.content.type, 'evt/post')
        console.log('res', res)
        sbot.close()
    })
})

