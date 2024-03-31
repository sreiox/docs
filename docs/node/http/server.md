---
outline: deep
---
## server

### server.close([callback])

停止服务器接受新连接并关闭连接到该服务器的所有未发送请求或等待响应的连接

### server.closeAllConnections()

关闭所有连接到此服务器的连接。

### server.closeIdleConnections()

关闭连接到此服务器的所有未发送请求或等待响应的连接。

### server.headersTimeout

限制解析器等待接收完整 HTTP 标头的时间。
如果超时到期，则服务器以状态 408 响应而不将请求转发给请求监听器，然后关闭连接。

必须将其设置为非零值（例如 120 秒）以防止潜在的拒绝服务攻击，以防在部署服务器之前没有反向代理的情况下。

### server.listen()

启动 HTTP 服务器监听连接

### server.listening

指示服务器是否正在监听连接

### server.maxHeadersCount

限制最大传入标头计数。如果设置为 0，则不会应用任何限制。

### server.requestTimeout

设置从客户端接收整个请求的超时值（以毫秒为单位）。

如果超时到期，则服务器以状态 408 响应而不将请求转发给请求监听器，然后关闭连接。

必须将其设置为非零值（例如 120 秒）以防止潜在的拒绝服务攻击，以防在部署服务器之前没有反向代理的情况下。

### server.setTimeout([msecs][, callback])

设置套接字的超时值，并在服务器对象上触发 'timeout' 事件，如果发生超时，则将套接字作为参数传入。

### server.maxRequestsPerSocket

关闭保持活动的连接之前，套接字可以处理的最大请求数。

`0` 值将禁用限制。

当达到限制时，则它会将 Connection 标头值设置为 close，但不会实际地关闭连接，达到限制后发送的后续请求将获得 503 Service Unavailable 作为响应。

### server.timeout

### server.keepAliveTimeout

在完成写入最后一个响应之后，在套接字将被销毁之前，服务器需要等待额外传入数据的不活动毫秒数。如果服务器在 keep-alive 超时触发之前收到新数据，则将重置常规的不活动超时，即 server.timeout。
值 0 将禁用传入连接上的保持活动超时行为。值 0 使 http 服务器的行为类似于 8.0.0 之前的 Node.js 版本，后者没有保持活动超时。

套接字超时逻辑是在连接上设置的，因此更改此值只会影响到服务器的新连接，而不会影响任何现有连接。