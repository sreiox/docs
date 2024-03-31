---
outline: deep
---

## http.IncomingMessage

IncomingMessage 对象由 http.Server 或 http.ClientRequest 创建，并分别作为第一个参数传给 'request' 和 'response' 事件。它可用于访问响应状态、标头和数据。

不同于其 socket 的值是 <stream.Duplex> 的子类，IncomingMessage 本身继承了 <stream.Readable> 并被单独创建以解析和触发传入的 HTTP 标头和有效载荷，因为在保持活动的情况下底层套接字可能被多次重用。

### event:close

当请求完成时触发。

### event:complete

如果已接收并成功解析完整的 HTTP 消息，则 message.complete 属性将为 true。

此属性作为一种确定客户端或服务器是否在连接终止之前完全传输消息的方法特别有用：

```js
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'The connection was terminated while the message was still being sent');
  });
});
```

### message.destroy([error])

在接收到 IncomingMessage 的套接字上调用 destroy()。如果提供了 error，则在套接字上触发 'error' 事件，并将 error 作为参数传给该事件的任何监听器。

### message.headers

请求/响应头对象。

标头名称和值的键值对。标头名称是小写的。

```js
// Prints something like:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
原始标头中的重复项按以下方式处理，具体取决于标头名称：

- 重复的 age、authorization、content-length、content-type、etag、expires、from、host、if-modified-since、if-unmodified-since、last-modified、location、max-forwards、proxy-authorization、referer、retry-after、server 或 user-agent 被丢弃。要允许合并上面列出的标头的重复值，请在 http.request() 和 http.createServer() 中使用选项 joinDuplicateHeaders。
- set-cookie 始终是数组。重复项被添加到数组中。
- 对于重复的 cookie 标头，值使用 ; 连接。
- 对于所有其他标头，值使用 , 连接。

### message.headersDistinct

类似于 message.headers，但没有连接逻辑，并且值始终是字符串数组，即使对于仅收到一次的标头也是如此。
```js
// Prints something like:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
```

### message.httpVersion

在服务器请求的情况下，客户端发送的 HTTP 版本。在客户端响应的情况下，连接到服务器的 HTTP 版本。可能是 '1.1' 或 '1.0'。

`message.httpVersionMajor` 是第一个整数，`message.httpVersionMinor` 是第二个。

### message.method

**仅对从 http.Server 获得的请求有效。**
请求方法作为字符串。只读。示例：'GET', 'DELETE'.

### message.rawHeaders

原始请求/响应头完全按照收到的方式列出。

键和值在同一个列表中。它不是元组列表。因此，偶数偏移是键值，奇数偏移是关联的值。

标头名称不小写，重复项不合并。

```js
// Prints something like:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
```

### message.rawTrailers

原始请求/响应尾标的键和值与收到的完全一样。仅在 'end' 事件中填充。

### message.setTimeout(msecs[, callback])

调用 message.socket.setTimeout(msecs, callback)。

### message.socket

与连接关联的 net.Socket 对象。

使用 HTTPS 支持，使用 request.socket.getPeerCertificate() 获取客户端的身份验证详细信息。

### message.statusCode

仅对从 http.ClientRequest (res.statusCode)获得的响应有效。3 位 HTTP 响应状态码

### message.statusMessage

HTTP 响应状态消息（原因短语）。E.G.OK 或 Internal Server Error。

### message.trailers

请求/响应尾标对象。仅在 'end' 事件中填充。

### message.trailersDistinct

类似于 message.trailers，但没有连接逻辑，并且值始终是字符串数组，即使对于仅收到一次的标头也是如此。仅在 'end' 事件中填充。

### message.url

仅对从 http.Server 获得的请求有效。

