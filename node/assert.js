const http = require('node:http')
const assert = require('node:assert/strict')

const server =  http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/plain', 'access-control-allow-origin': '*' })
    res.end('返回数据')
})

try {
    assert.deepEqual([[1,2,3], 3], [[1,2,'3'],3], 'bufu')
} catch (error) {
    // console.error('AssertionError:', error)
}

function myCustomAssertion(condition, message){
    if(!condition){
        throw new assert.AssertionError({
            message: message || 'assertion failed',
            actual: condition,
            expected: true,
            operator: '==='
        })
    }
    
}

try {
    // myCustomAssertion(false, 'custom assertion failed')
    assert('', 'sha')
} catch (error) {
    console.error(error)
}

server.listen('3000', '127.0.0.1', ()=>{
    console.log('server start...')
})