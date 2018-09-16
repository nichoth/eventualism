var startSSB = require('./start-ssb')

var ssb = startSSB()
console.log('ssb', ssb)

// process.nextTick(function () {
//     ssb.close()
// })

