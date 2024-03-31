---
outline: deep
---

## http.OutgoingMessage

该类作为 http.ClientRequest 和 http.ServerResponse 的父类。从 HTTP 事务的参与者的角度来看，这是抽象的传出消息。

### event: drain

当消息的缓冲区再次空闲时触发。

### event: finish

当传输成功完成时触发。

### event: prefinish

调用 outgoingMessage.end() 后触发。触发事件时，所有数据都已处理，但不一定完全刷新。

### outgoingMessage.addTrailers(headers)

- headers `<Object>`

添加 HTTP 尾标（标头，但在消息末尾）到消息。

仅当消息经过分块编码时才会触发标尾。如果没有，则块头将被默默丢弃。

HTTP 要求发送 Trailer 标头以触发块头，其值中包含标头字段名称列表，例如

```js
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```
尝试设置包含无效字符的标头字段名称或值将导致抛出 TypeError。

### outgoingMessage.appendHeader(name, value)

为标头对象附加单一个标头值

如果值为数组，则相当于多次调用该方法

如果标头没有先前的值，则这相当于调用 outgoingMessage.setHeader(name, value)。

根据创建客户端请求或服务器时 options.uniqueHeaders 的值，这将导致标头多次发送或单次发送，并使用 ; 连接值。

### outgoingMessage.cork()

### outgoingMessage.destroy([error])

销毁消息。一旦套接字与消息关联并连接，则该套接字也将被销毁。

### outgoingMessage.end(chunk[, encoding][, callback])

完成传出消息。如果正文的任何部分未发送，则会将它们刷新到底层系统。如果消息被分块，则它将发送终止块 0\r\n\r\n，并发送块尾（如果有）。

如果指定了 chunk，则相当于调用 outgoingMessage.write(chunk, encoding)，后跟 outgoingMessage.end(callback)。

如果提供了 callback，则在消息结束时调用（相当于 'finish' 事件的监听器）。

### outgoingMessage.flushHeaders()

刷新消息标头。

出于效率原因，Node.js 通常会缓冲消息头，直到调用 outgoingMessage.end() 或写入第一块消息数据。然后它尝试将标头和数据打包到单个 TCP 数据包中。

通常是需要的（节省了 TCP 往返），但不是在第一个数据没有被发送的时候，直到可能很晚。outgoingMessage.flushHeaders() 绕过优化并启动消息。

### outgoingMessage.getHeader(name)

### outgoingMessage.getHeaderNames()

### outgoingMessage.getHeaders()

### outgoingMessage.hasHeader(name)

### outgoingMessage.headersSent

### outgoingMessage.pipe()

调用此方法将抛出 Error，因为 outgoingMessage 是只写流。

### outgoingMessage.removeHeader(name)

### outgoingMessage.setHeader(name, value)

### outgoingMessage.setHeaders(headers)

### outgoingMessage.setTimeout(msesc[, callback])

### outgoingMessage.socket

### outgoingMessage.uncork()

### outgoingMessage.writableCorked

调用 outgoingMessage.cork() 的次数。

### outgoingMessage.writableEnded

- `<boolean>`

如果调用了 outgoingMessage.end()，则为 true。该属性不表示数据是否被刷新。为此目的，则改用 message.writableFinished。

### outgoingMessage.writableFinished

### outgoingMessage.writableHighWaterMark

### outgoingMessage.writableLength

### outgoingMessage.writableObjectMode

### outgoingMessage.write(chunk[, encoding][, callback])
