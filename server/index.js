var startSSB = require('./start-ssb')


var ssb = startSSB()
console.log('ssb', ssb)
ssb.close()

