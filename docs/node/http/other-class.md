---
outline: deep
---
## http.METHODS

解析器支持的 HTTP 方法列表。

## http.STATUS_CODES

所有标准 HTTP 响应状态代码的集合，以及每个的简短描述。例如，http.STATUS_CODES[404] === 'Not Found'。

```js
{
  '100': 'Continue',
  '101': 'Switching Protocols',
  '102': 'Processing',
  '103': 'Early Hints',
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '207': 'Multi-Status',
  '208': 'Already Reported',
  '226': 'IM Used',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Found',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '307': 'Temporary Redirect',
  '308': 'Permanent Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Timeout',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Payload Too Large',
  '414': 'URI Too Long',
  '415': 'Unsupported Media Type',
  '416': 'Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': "I'm a Teapot",
  '421': 'Misdirected Request',
  '422': 'Unprocessable Entity',
  '423': 'Locked',
  '424': 'Failed Dependency',
  '425': 'Too Early',
  '426': 'Upgrade Required',
  '428': 'Precondition Required',
  '429': 'Too Many Requests',
  '431': 'Request Header Fields Too Large',
  '451': 'Unavailable For Legal Reasons',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported',
  '506': 'Variant Also Negotiates',
  '507': 'Insufficient Storage',
  '508': 'Loop Detected',
  '509': 'Bandwidth Limit Exceeded',
  '510': 'Not Extended',
  '511': 'Network Authentication Required'
}
```

### http.createServer([options][, requestListener])

- options `<Object>`
    - connectionsCheckingInterval: 以毫秒为单位设置间隔值，以检查不完整请求中的请求和标头超时。默认值：30000。
    - headersTimeout: 设置从客户端接收完整 HTTP 标头的超时值，以毫秒为单位。有关详细信息，请参阅 server.headersTimeout。默认值：60000。
    - highWaterMark: 
    - insecureHTTPParser: 使用不安全的 HTTP 解析器，当为 true 时接受无效的 HTTP 标头。应避免使用不安全的解析器。有关详细信息，请参阅 --insecure-http-parser。默认值：false。
    - IncomingMessage: 指定要使用的 IncomingMessage 类。用于扩展原始的 IncomingMessage。默认值：IncomingMessage。
    - joinDuplicateHeaders: 如果设置为 true，则此选项允许使用逗号 (, ) 连接请求中多个标头的字段行值，而不是丢弃重复项。欲了解更多信息，请参阅 message.headers。默认值：false。
    - keepAlive: 如果设置为 true，则在收到新的传入连接后立即启用套接字上的保持活动功能，与 [socket.setKeepAlive([enable][, initialDelay])][socket.setKeepAlive(enable, initialDelay)] 中的操作类似。默认值：false。
    - keepAliveInitialDelay: 如果设置为正数，则它会设置在空闲套接字上发送第一个保持活跃探测之前的初始延迟。默认值：0。
    - keepAliveTimeout: 在完成写入最后一个响应之后，在套接字将被销毁之前，服务器需要等待额外传入数据的不活动毫秒数。有关详细信息，请参阅 server.keepAliveTimeout。默认值：5000。
    - maxHeaderSize: 可选地覆盖此服务器接收到的请求的 --max-http-header-size 值，即请求标头的最大长度（以字节为单位）。默认值：16384 (16 KiB)。
    - noDelay: 如果设置为 true，则它会在收到新的传入连接后立即禁用 Nagle 算法。默认值：true。
    - requestTimeout: 设置从客户端接收整个请求的超时值（以毫秒为单位）。有关详细信息，请参阅 server.requestTimeout。默认值：300000。
    - requireHostHeader: 如果设置为 true，它会强制服务器以 400（错误请求）状态代码响应任何缺少主机标头（按照规范的规定）的 HTTP/1.1 请求消息。默认值：true。
    - ServerResponse
    - uniqueHeaders

```js
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

## http.get(options[, callback])

## http.get(url[, options][, callback])

由于大多数请求是没有正文的 GET 请求，因此 Node.js 提供了这个便捷的方法。该方法与 http.request() 唯一的区别是它默认设置方法为 GET 并自动调用 req.end()。因为 http.ClientRequest 章节所述的原因，回调必须注意消费响应数据。

```js
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // Any 2xx status code signals a successful response but
  // here we're only checking for 200.
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // Consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

## http.globalAgent

Agent 的全局实例，用作所有 HTTP 客户端请求的默认值。

## http.maxHeaderSize

只读属性，指定 HTTP 标头的最大允许大小（以字节为单位）。默认为 16 KiB。可使用 --max-http-header-size 命令行选项进行配置。

这可以通过传入 maxHeaderSize 选项为服务器和客户端请求覆盖。

## http.request(options[, callback])

## http.request(url[, options][, callback])

- url
- options
    - agent
    - auth: 用于计算授权标头的基本身份验证 ('user:password')。
    - createConnection
    - defaultPort: 协议的默认端口。默认值：如果使用 Agent，则为 agent.defaultPort，否则为 undefined。
    - family: 解析 host 或 hostname 时使用的 IP 地址族。有效值为 4 或 6。当未指定时，则将使用 IP v4 和 v6。
    - headers: 包含请求头的对象。
    - hints
    - host: 要向其触发请求的服务器的域名或 IP 地址。默认值：'localhost'。
    - hostname: host 的别名。为了支持 url.parse()，如果同时指定了 host 和 hostname，则将使用 hostname。
    - insecureHTTPParser: 使用不安全的 HTTP 解析器，当为 true 时接受无效的 HTTP 标头。应避免使用不安全的解析器。有关详细信息，请参阅 --insecure-http-parser。默认值：false
    - joinDuplicateHeaders: 它使用 , 连接请求中多个标头的字段行值，而不是丢弃重复项。有关详细信息，请参阅 message.headers。默认值：false。
    - localAddress: 用于绑定网络连接的本地接口。
    - localPort: 连接的本地端口。
    - lookup: 自定义查找函数
    - maxHeaderSize: 对于从服务器接收到的响应，可选择覆盖 --max-http-header-size 的值（响应标头的最大长度，以字节为单位）。默认值：16384 (16 KiB)。
    - method: 指定 HTTP 请求方法的字符串。默认值：'GET'。
    - path: 请求的路径。应包括查询字符串（如果有）。E.G.'/index.html?page=12'。当请求路径包含非法字符时抛出异常。目前，只有空格被拒绝，但将来可能会改变。默认值：'/'。
    - port: 远程服务器的端口。默认值：如果设置则为 defaultPort，否则为 80。
    - protocol: 要使用的协议。默认值：'http:'。
    - setHost: 指定是否自动添加 Host 标头。默认为 true。
    - signal: 可用于中止正在进行的请求的中止信号。
    - socketPath: Unix 域套接字。如果指定了 host 或 port 之一，则不能使用，因为它们指定了 TCP 套接字。
    - timeout: 以毫秒为单位指定套接字超时的数字。这将在连接套接字之前设置超时。
    - uniqueHeaders: 只应发送一次的请求标头列表。如果标头的值是数组，则子项将使用 ; 连接。

url 可以是字符串或 URL 对象。如果 url 是字符串，则会自动使用 new URL() 解析。如果是 URL 对象，则会自动转换为普通的 options 对象。

如果同时指定了 url 和 options，则合并对象，options 属性优先。

可选的 callback 参数将被添加为 'response' 事件的单次监听器。

`http.request() 返回 http.ClientRequest 类的实例`。ClientRequest 实例是可写流。如果需要使用 POST 请求上传文件，则写入 ClientRequest 对象。

```js
const http = require('node:http');

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```

在示例中，调用了 req.end()。对于 http.request()，必须始终调用 req.end() 以表示请求结束 - 即使没有数据写入请求正文。

如果在请求期间遇到任何错误（无论是 DNS 解析、TCP 级别错误还是实际的 HTTP 解析错误），都会在返回的请求对象上触发 'error' 事件。与所有 'error' 事件一样，如果没有注册监听器，则会抛出错误。

有一些特殊的标头需要注意。

- 发送“连接：keep-alive' 将通知 Node.js 与服务器的连接应该保持到下一个请求。
- 发送 '内容长度' 标头将禁用默认的分块编码。
- 发送 '预计' 标头将立即发送请求标头。通常，发送 'Expect:100-continue'，应设置 'continue' 事件的超时和监听器。
- 发送授权标头将覆盖使用 auth 选项来计算基本身份验证。

使用 URL 作为 options 的示例：
```js
const options = new URL('http://abc:xyz@example.com');

const req = http.request(options, (res) => {
  // ...
});
```
在成功的请求中，将按以下顺序触发以下事件，参考[https://nodejs.cn/api/http.html#httprequesturl-options-callback]

- 'socket'
- 'response'
    - res 对象上的 'data'，任意次数（如果响应正文为空，则根本不会触发 'data'，例如，在大多数重定向中）
    - res 对象上的 'end'
- 'close'

在连接错误的情况下，将触发以下事件：
 
- 'socket'
- 'error'
- 'close'


在收到响应之前过早关闭连接的情况下，将按以下顺序触发以下事件：

- 'socket'
- 使用具有消息 'Error: socket hang up' 和代码 'ECONNRESET' 的错误的 'error'
- 'close'

在收到响应之后过早关闭连接的情况下，将按以下顺序触发以下事件：

- 'socket'
- 'response'
    - res 对象上的 'data'，任意次数
- （在此处关闭连接）
- res 对象上的 'aborted'
- res 对象上的 'error' 错误消息 'Error: aborted' 和代码 'ECONNRESET'
- 'close'
- res 对象上的 'close'

···

## http.validateHeaderName(name[, label])

在调用 res.setHeader(name, value) 时对提供的 name 执行低层验证

将非法值作为 name 传入将导致抛出 TypeError，由 code: 'ERR_INVALID_HTTP_TOKEN' 标识。

在将标头传给 HTTP 请求或响应之前，不必使用此方法。HTTP 模块将自动验证此类标头。

```js
const { validateHeaderName } = require('node:http');

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```

## http.validateHeaderValue(name, value)

在调用 res.setHeader(name, value) 时对提供的 value 执行低层验证。

将非法值作为 value 传入将导致抛出 TypeError。

- 未定义值错误由 code: 'ERR_HTTP_INVALID_HEADER_VALUE' 标识。
- 无效值字符错误由 code: 'ERR_INVALID_CHAR' 标识。

在将标头传给 HTTP 请求或响应之前，不必使用此方法。HTTP 模块将自动验证此类标头。

```js
const { validateHeaderValue } = require('node:http');

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```

## http.setMaxIdleHTTPParsers(max)

设置最大空闲 HTTP 解析器数。