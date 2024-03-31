---
outline: deep
---

## HTTP 超文本传输协定

要使用 HTTP 服务器和客户端，必须 **require('node:http')**

HTTP 消息头由类似这样的对象表示：
```js
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
```

### http.Agent

- keepAlive: 
- keepAliveMsecs
- maxSockets
- maxTotalSockets
- maxFreeSockets
- scheduling
- timeout

```js
const http = require('node:http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
```

#### agent.createConnection(options[, callback])
#### agent.keepSocketAlive(socket)
#### agent.reuseSocket(socket, request)
#### agent.destroy()

销毁代理当前正在使用的任何套接字。

#### agent.freeSockets
#### agent.getName

- host
- port
- localAddress
- family

#### agent.maxFreeSockets

默认设置为 256。对于启用了 keepAlive 的代理，这将设置在空闲状态下开放的最大套接字数量。

#### agent.maxSockets

默认设置为 Infinity 。确定代理在每个源点可以打开多少个并发套接字。

#### agent.maxTotalSockets

默认设置为 Infinity 。决定代理可以打开多少个并发套接字

#### agent.requests

包含尚未分配给套接字的请求队列的对象。请勿修改。

#### agent.sockets

包含代理当前使用的套接字数组的对象。请勿修改
