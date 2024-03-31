---
outline: deep
---

## http.ClientRequest

此对象从 http.request() 内部创建并返回。它表示一个正在进行的请求，其标头已经排队。使用 setHeader(name, value)、getHeader(name)、removeHeader(name) API 时，标头仍然是可变的。实际标头将与第一个数据块一起发送或在调用 request.end() 时发送。

要获得响应，则将 'response' 的监听器添加到请求对象。当接收到响应头时，则请求对象会触发 'response'。'response' 事件使用一个参数执行，该参数是 http.IncomingMessage 的实例。

在 'response' 事件期间，可以向响应对象添加监听器；特别是监听 'data' 事件。

如果没有添加 'response' 句柄，则响应将被完全丢弃。但是，如果添加了 'response' 事件处理程序，则必须使用来自响应对象的数据，方法是在出现 'readable' 事件时调用 response.read()，或者添加 'data' 处理程序，或者通过调用 .resume() 方法。在数据被消费之前，不会触发 'end' 事件。此外，在读取数据之前，它将消耗内存，最终导致 '进程内存不足' 错误。

为了向后兼容，如果注册了 'error' 监听器，则 res 只会触发 'error'。

设置 Content-Length 标头以限制响应正文大小。如果 response.strictContentLength 设置为 true，与 Content-Length 标头值不匹配将导致抛出 Error，由 code: 'ERR_HTTP_CONTENT_LENGTH_MISMATCH' 标识。

Content-Length 值应该以字节为单位，而不是字符。使用 Buffer.byteLength() 来确定正文的长度（以字节为单位）。

### request.cork()

### request.end([data[, encoding]][, callback])

如果指定了 data ，则相当于调用 request.write(data, encoding) 后接 request.end(callback) 。

如果指定了 callback ，则会在请求流结束时调用。

### request.destroy([error])

销毁请求。可选择发出 'error' 事件和 'close' 事件。调用该事件将导致丢弃响应中的剩余数据并销毁套接字。

### request.destroyed

### request.flushHeaders()

刷新请求头。

出于效率考虑，Node.js 通常会缓冲请求头，直到调用 request.end() 或写入第一块请求数据。然后，它会尝试将请求头和数据打包成一个 TCP 数据包。

这通常是合乎需要的（可以节省一次 TCP 往返），但当第一个数据要到很久以后才发送时，情况就不一样了。 request.flushHeaders() 绕过了优化，启动了请求。

### request.getHeader(name)

读出请求的头信息。名称不区分大小写。返回值的类型取决于为 request.setHeader() 提供的参数。

```js
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' is 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' is of type number
const cookie = request.getHeader('Cookie');
// 'cookie' is of type string[]
```

### request.getHeaderNames()

返回一个数组，其中包含当前传出标头的唯一名称。所有标头名称均小写。

```js
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
```

### request.getHeaders()

返回当前传出头信息的浅层副本。由于使用的是浅层拷贝，因此可以更改数组值，而无需额外调用各种与头相关的 http 模块方法。返回对象的键是标头名称，值是各自的标头值。所有标头名称均小写。

由 request.getHeaders() 方法返回的对象原型并不继承自 JavaScript 的 Object 方法。这意味着 obj.toString() 、 obj.hasOwnProperty() 等典型的 Object 方法没有被定义，也无法使用。

```js
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
```

### request.getRawHeaderNames()

返回一个数组，其中包含当前传出的原始报头的唯一名称。返回的标头名称将设置精确的大小写。

```js
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
```

### request.hasHeader(name)

如果 name 标识的报头当前已在传出报头中设置，则返回 true 。头信息名称匹配不区分大小写。

```js
const hasContentType = request.hasHeader('content-type');
```

### request.maxHeadersCount

限制最大响应标头计数。如果设置为 0，则不会应用任何限制。

### request.path

### request.method

### request.host

### request.protocol

### request.removeHeader(name)

删除头信息对象中已定义的头信息。

```js
request.removeHeader('Content-Type');
```

### request.reusedSocket

是否通过重复使用的套接字发送请求。

通过启用了保持连接的代理发送请求时，底层套接字可能会被重复使用。但如果服务器在不幸的时候关闭了连接，客户端可能会遇到 "ECONNRESET "错误。

```js
const http = require('node:http');
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // Check if retry is needed
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```

### request.setHeader(name, value)

为 headers 对象设置单个标题值。如果要发送的头信息中已经存在该头信息，其值将被替换。在此使用字符串数组可发送多个同名头信息。非字符串值将不加修改地存储。因此， request.getHeader() 可能会返回非字符串值。不过，非字符串值将被转换为字符串，以便在网络上传输。

```js
request.setHeader('Content-Type', 'application/json');
```
or
```js
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```

如果需要在值中传递 UTF-8 字符，请使用 RFC 8187 标准对值进行编码。

```js
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
```

### request.setNoDelay([noDelay])

一旦为该请求分配了套接字并连接上 socket.setNoDelay() 就会被调用。

### request.setSocketKeepAlive([enable][, initialDelay])

一旦为该请求分配了套接字并连接上 socket.setKeepAlive() 就会被调用。

### request.setTimeout(timeout[, callback])

### request.socket

### request.uncork()

### request.writableEnded

是调用 request.end() 后的 true 。该属性并不表示数据是否已被刷新，因此请使用 request.writableFinished 代替。

### request.writableFinished

### request.write(chunk[, encoding][, callback])

发送一大段正文。此方法可被多次调用。如果没有设置 Content-Length ，数据将自动以 HTTP Chunked 传输编码方式编码，以便服务器知道数据何时结束。会添加 Transfer-Encoding: chunked 头信息。必须调用 request.end() 才能完成请求的发送。

