var Koa = require('koa')
var app = new Koa()
var Router = require('koa-router')()
const fs = require('fs')

Router.get("/", async (ctx) => {
    const getResource = () => {
        return new Promise((res) => {
            fs.readFile("./fs/a.txt", (err, data) => {
                if (err) {
                    console.log(err, 'read error')
                    return;
                }
                res(data)
            })
        })
    }
    ctx.set('Cache-Control', 'max-age=10')  //设置强缓存，过期时间为10秒
    ctx.body = await getResource(); 

    // ctx.body = 'ok'
})

Router.get("/pp", async (ctx) => {
    const ifModifiedSince = ctx.request.header['if-modified-since']
    const getResource = () => {
        return new Promise((res) => {
            fs.stat('./fs/a.txt', (err, stats) => {
                if(err) return
                res(stats)
            })
        })
    }

    let resource = await getResource()
    console.log(resource)
    if(ifModifiedSince === resource.mtime.toGMTString()){
        ctx.status = 304
    }
    console.log('到这儿了')
    ctx.set('Last-Modified', resource.mtime.toGMTString())
    ctx.body = resource
})


app.use(Router.routes()).use(Router.allowedMethods())
app.listen(8000)