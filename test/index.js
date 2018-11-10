var test = require('tape')
var Sbot = require('scuttle-testbot')
var { createState } = require('../src/state')
var Effects = require('../src/effects')

test('Publish a message', function (t) {
    t.plan(2)
    var sbot = Sbot()
    var state = createState()
    var effects = Effects({ state })

    var msg = {
        type: 'post',
        text: 'hello world'
    }

    effects.publishPost(sbot, msg, function (err, res) {
        t.error(err)
        t.equal(res.value.content.text, 'hello world')
        console.log('res', res)
        sbot.close()
    })
})

