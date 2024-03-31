const http = require('node:http')
const { AsyncLocalStorage } = require('node:async_hooks')

const asyncLocalStorage = new AsyncLocalStorage()

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8', 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })
    if(req.method === 'POST' && req.url === '/login'){
        let data = ''
        req.on('data', (body) => {
            data = JSON.parse(body)
        })
        req.on('end', ()=>{
            asyncLocalStorage.run(data, ()=>{
                res.end('login success')
            })
        })
    }else if(req.url === '/getUser'){
        const context = asyncLocalStorage.getStore()
        console.log(context)
        res.end('获取列表')
    }else{
        res.end('connection success')
    }
})

server.listen(3030, '127.0.0.1', ()=>{
    console.log('server start...')
})