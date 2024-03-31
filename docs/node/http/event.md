---
outline: deep
---

## Event

### close

表示请求已完成，或其基础连接已被 过早终止（在响应完成之前）。

### connect

```js
const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

### continue

服务器发送 "100 Continue "HTTP 响应时发出，通常是因为 请求中包含 "Expect: 100-continue"。这是一条指令 客户端应发送请求正文。

### finish

请求已发送时发出。更具体地说，该事件会在 当响应标头和正文的最后一段已移交给 操作系统，以便在网络上传输。这并不意味着 服务器尚未收到任何信息。

### information

- inf对象
    - httpVersion
    - httpVersionMajor
    - httpVersionMinor
    - statusCode
    - statusMessage
    - headers
    - rawHeaders

当服务器发送 1xx 中间响应（不包括 101 升级）。该事件的侦听器将收到一个对象，其中包含 HTTP 版本、状态代码、状态信息、键值标头对象、 和数组，其中包含原始标头名称及其各自的值。

```js
const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = http.request(options);
req.end();

//没效果啊？
req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});

//换成下面的
const options = {
    host: '192.168.124.6', port: 3000, path: '/'
};

// Make a request
const req = http.request(options, res=>{
    console.log('info响应', res.httpVersionMinor)
});
req.end();
```

### response

当收到对该请求的响应时发出。该事件仅在 一次

### socket

除非用户指定了 <net.Socket> 以外的套接字类型，否则该事件保证传递 <net.Socket> 类（<stream.Duplex> 的子类）的实例。

### timeout

当底层套接字因未活动而超时时发出。这只会通知 该套接字一直处于空闲状态。必须手动销毁请求。

### upgrade

每次服务器响应升级请求时发出。如果该 事件未被监听，响应状态代码为 101 正在切换 协议，收到升级标头的客户机会将其连接 关闭。


## http.server

### checkContinue

每次收到带有 HTTP Expect: 100-continue 的请求时发出。如果该事件未被监听，服务器将自动以 100 Continue 作为适当的回应。

处理该事件时，如果客户端应继续发送请求正文，则调用 response.writeContinue() ；如果客户端不应继续发送请求正文，则生成适当的 HTTP 响应（如 400 Bad Request）。

### checkExpectation

每次接收到带有 HTTP Expect 头信息的请求，且该头信息的值不是 100-continue 时发出。 如果未监听该事件，服务器将自动以 417 Expectation Failed 作为适当的响应

### clientError

```js
server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
```

### close

服务器关闭时发出

### connect

### connection

```js
// 监听 connection 事件
server.on('connection', (socket) => {
    console.log('客户端连接已建立');
    
    // 在这里可以执行一些与连接相关的逻辑
    // 例如记录连接数、跟踪连接的状态等
  });
```

### dropRequest

当套接字上的请求数达到 server.maxRequestsPerSocket 的阈值时，服务器将放弃新的请求并发出 'dropRequest' 事件，然后向客户端发送 503 。

### request

每次有请求时发出。每个连接可能有多个请求（在 HTTP Keep-Alive 连接的情况下）。

### upgrade

每次客户端请求 HTTP 升级时触发。监听此事件是可选的，客户端不能坚持协议更改。




