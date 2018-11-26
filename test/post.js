// require('dotenv').config()
var fs = require('fs')
var { createState } = require('../src/state')
var Effects = require('../src/effects')

var filePath = __dirname + '/iguana.jpg'

module.exports = function ({ sbot, test }) {
    var msgResult

    test('Publish a message', function (t) {
        t.plan(4)
        var state = createState()
        var effects = Effects({ state })

        var fileBuffer = fs.readFileSync(filePath)

        var msg = {
            file: fileBuffer,
            description: 'hello world'
        }

        effects.publishPost(sbot, msg, function (err, res) {
            t.error(err)
            t.equal(res.value.content.description, msg.description,
                'should have description')
            t.ok(res.value.content.fileData, 'should have fileId')
            t.equal(res.value.content.type, 'evt/post',
                'should have message type')

            msgResult = res
        })
    })

    test('get blob from message', function (t) {
        t.plan(2)
        var { getBlobFromMessage } = Effects

        getBlobFromMessage(sbot, msgResult, function (err, blob) {
            t.error(err)
            var file = fs.readFileSync(filePath)
            t.equal(blob.toString(), file.toString(), 'should return buffer')
        })
    })
}

