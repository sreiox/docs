---
outline: deep
---

## http.ServerResponse

此对象由 HTTP 服务器内部创建，而不是由用户创建。它作为第二个参数传给 'request' 事件。

### event: close

表示响应已完成，或者其底层连接提前终止（在响应完成之前）。

### event：finish

发送响应时触发。更具体地说，当响应头和正文的最后一段已移交给操作系统以通过网络传输时，则将触发此事件。这并不意味着客户端已收到任何东西。

### response.addTrailers(headers)

此方法向响应添加 HTTP 尾随标头（标头，但位于消息末尾）。
仅当响应使用分块编码时才会触发标尾；如果不是（例如，如果请求是 HTTP/1.0），它们将被静默丢弃。

HTTP 要求发送 Trailer 标头以触发尾标，其值中包含标头字段列表。例如，
```js
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```
尝试设置包含无效字符的标头字段名称或值将导致抛出 `TypeError`

### response.cork()

### <font color='red'>response.end([data[, encoding]][, callback])</font>

此方法向服务器触发信号，表明已发送所有响应标头和正文；该服务器应认为此消息已完成。response.end() 方法必须在每个响应上调用。
如果指定了 data，则其效果类似于调用 response.write(data, encoding) 后跟 response.end(callback)。
如果指定了 callback，则将在响应流完成时调用。

### response.flushHeaders()

刷新响应头

### <font color='red'>response.getHeader(name)</font>

读取已排队但未发送到客户端的标头。该名称不区分大小写。返回值的类型取决于提供给 response.setHeader() 的参数。

```js
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType is 'text/html'
const contentLength = response.getHeader('Content-Length');
// contentLength is of type number
const setCookie = response.getHeader('set-cookie');
// setCookie is of type string[]
```
### <font color='red'>response.getHeaderNames()</font>

返回包含当前传出标头的唯一名称的数组。所有标头名称均为小写。

```js
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```
### <font color='red'>response.getHeaders()</font>

返回当前传出标头的浅拷贝。由于使用了浅拷贝，因此无需额外调用各种与标头相关的 http 模块方法即可更改数组值。返回对象的键是标头名称，值是相应的标头值。所有标头名称均为小写。
response.getHeaders() 方法返回的对象不是原型继承自 JavaScript Object。这意味着 obj.toString()、obj.hasOwnProperty() 等典型的 Object 方法没有定义，将不起​​作用。
```js
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```

### <font color='red'>response.hasHeader(name)</font>

如果 name 标识的标头当前设置在传出标头中，则返回 true。标头名称匹配不区分大小写。
```js
const hasContentType = response.hasHeader('content-type');
```

### response.headersSent

布尔值（只读）。如果标头被发送，则为真，否则为假。

### response.removeHeader(name)

删除排队等待隐式发送的标头

```js
response.removeHeader('Content-Encoding');
```
### response.req

对原始的 HTTP request 对象的引用。

### response.sendDate

如果为真，则 Date 标头将自动生成并在响应中发送，如果它尚未出现在标头中。默认为真。
这应该只在测试时被禁用；`HTTP 要求在响应中使用 Date 标头`

### <font color='red'>response.setHeader(name, value)</font>

返回响应对象。

为隐式标头设置单个标头值。如果该标头已经存在于待发送的标头中，则其值将被替换。在此处使用字符串数组发送具有相同名称的多个标头。非字符串值将不加修改地存储。因此，response.getHeader() 可能返回非字符串值。但是，非字符串值将转换为字符串以进行网络传输。相同的响应对象返回给调用者，以启用调用链。

```js
response.setHeader('Content-Type', 'text/html'); 
```
or
```js
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
尝试设置包含无效字符的标头字段名称或值将导致抛出 `TypeError。`

当标头已使用 `response.setHeader()` 设置时，则它们将与任何传给 `response.writeHead()` 的标头合并，其中传给 `response.writeHead() 的标头优先`。
```js
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
如果调用了 response.writeHead() 方法而该方法没有被调用，则会直接将提供的标头值写入网络通道，而不进行内部缓存，标头的 response.getHeader() 不会产生预期的结果。`如果希望在将来可能进行检索和修改时逐步填充标头，则使用 response.setHeader() 而不是 response.writeHead()。`

### response.setTimeout(msecs[, callback])

将套接字的超时值设置为 msecs。如果提供了回调，则将其添加为响应对象上 'timeout' 事件的监听器。

如果没有向请求、响应或服务器添加 'timeout' 监听器，则套接字在超时时会被销毁。如果将句柄分配给请求、响应或服务器的 'timeout' 事件，则必须显式处理超时套接字。

### response.socket

对底层套接字的引用。通常用户不会想要访问这个属性。特别是，由于协议解析器附加到套接字的方式，套接字将不会触发 'readable' 事件。在 response.end() 之后，该属性为空。
```js
const http = require('node:http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

### <font color='red'>response.statusCode</font>

使用隐式标头（不显式调用 response.writeHead()）时，此属性控制在标头刷新时将发送到客户端的状态码。

```js
response.statusCode = 404;
```
响应头发送到客户端后，该属性表示发送出去的状态码。

### response.statusMessage

当使用隐式标头（不显式调用 response.writeHead()）时，此属性控制在标头刷新时将发送到客户端的状态消息。如果保留为 undefined，则将使用状态码的标准消息。

```js
response.statusMessage = 'Not found';
```
响应头发送到客户端后，该属性表示发送出去的状态消息。

### response.strictContentLength

- `<boolean>` 默认值：false

如果设置为 true，Node.js 将检查 Content-Length 标头值和正文大小（以字节为单位）是否相等。与 Content-Length 标头值不匹配将导致抛出 Error，由 code: `'ERR_HTTP_CONTENT_LENGTH_MISMATCH'` 标识。

### response.uncork()

### response.writableEnded

- `<boolean>`

在调用 response.end() 之后是 true。此属性不指示数据是否已刷新，为此则使用 response.writableFinished 代替。

### response.writableFinished

- `<boolean>`

如果所有数据都已在 'finish' 事件触发之前立即刷新到底层系统，则为 true。

### <font color='red'>response.write(chunk[, encoding][, callback])</font>

如果此方法被调用且 response.writeHead() 还没被调用，则会切换到隐式的标头模式并刷新隐式的标头。

`这会发送一块响应正文。可以多次调用此方法以提供正文的连续部分。`
当请求方法或响应状态不支持内容时，不允许写入正文。如果尝试写入正文以获取 HEAD 请求或作为 204 或 304 响应的一部分，则会抛出代码为 ERR_HTTP_BODY_NOT_ALLOWED 的同步 Error。

chunk 可以是字符串或缓冲区。如果 chunk 是字符串，则第二个参数指定如何将其编码为字节流。当刷新数据块时将调用 callback。

这是原始的 HTTP 正文，与可能使用的更高级别的多部分正文编码无关。

第一次调用 response.write() 时，它会将缓存的标头信息和正文的第一个块发送给客户端。第二次调用 response.write() 时，Node.js 会假定数据将被流式传输，并单独发送新数据。也就是说，响应被缓冲到正文的第一个块。

如果整个数据被成功刷新到内核缓冲区，则返回 true。如果所有或部分数据在用户内存中排队，则返回 false。当缓冲区再次空闲时，则将触发 'drain'。

### response.writeContinue()

向客户端发送 HTTP/1.1 100 Continue 消息，指示应发送请求正文。请参阅 Server 上的 'checkContinue' 事件。

### response.writeEarlyHints(hints[, callback])

向客户端发送带有 Link 标头的 HTTP/1.1 103 Early Hints 消息，指示用户代理可以预加载/预连接链接的资源。hints 是一个包含要与早期提示消息一起发送的标头值的对象。写入响应消息后，将调用可选的 callback 参数。

```js
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```

### response.writeHead(statusCode[, statusMessage][, headers])

向请求发送响应头。状态码是 3 位的 HTTP 状态码，如 404。最后一个参数 headers 是响应头。可选地给定人类可读的 statusMessage 作为第二个参数。

headers 可以是 Array，其中键和值在同一个列表中。它不是元组列表。因此，偶数偏移是键值，奇数偏移是关联的值。该数组的格式与 request.rawHeaders 相同。
返回对 ServerResponse 的引用，以便可以链式调用。

```js
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```

此方法只能在消息上调用一次，并且必须在调用 response.end() 之前调用。

如果在调用此之前调用了 response.write() 或 response.end()，则将计算隐式/可变的标头并调用此函数。

当标头已使用 response.setHeader() 设置时，则它们将与任何传给 response.writeHead() 的标头合并，其中传给 `response.writeHead() 的标头优先`。

如果调用了此方法，且还没调用 response.setHeader()，则会直接将提供的标头值写入网络通道且内部不缓存，在标头上 response.getHeader() 不会产生预期的结果。如果需要逐步填充标头并在未来进行`潜在的检索和修改`，则改用 response.setHeader()。

```js
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
Content-Length 以字节而不是字符读取。使用 Buffer.byteLength() 来确定正文的长度（以字节为单位）。Node.js 会检查 Content-Length 和已经传输的 body 的长度是否相等。

尝试设置包含无效字符的标头字段名称或值将导致抛出 [Error][Error]。

### response.writeProcessing()

向客户端发送 HTTP/1.1 102 Processing 消息，表示应发送请求正文。