// require('dotenv').config()
var fs = require('fs')
var toPull = require('stream-to-pull-stream')
var { createState } = require('../src/state')
var Effects = require('../src/effects')

module.exports = function ({ sbot, test }) {
    test('Publish a message', function (t) {
        t.plan(4)
        var state = createState()
        var effects = Effects({ state })

        var filePath = __dirname + '/iguana.jpg'
        var msg = {
            file: toPull.source(fs.createReadStream(filePath)),
            description: 'hello world'
        }

        effects.publishPost(sbot, msg, function (err, res) {
            console.log('res', res)
            t.error(err)
            t.deepEqual(res.value.content.description, msg.description)
            t.ok(res.value.content.fileData)
            t.equal(res.value.content.type, 'evt/post')
        })
    })

}

