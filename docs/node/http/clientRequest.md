---
outline: deep
---

该对象由内部创建，并从 `http.request()` 返回。 它代表一个正在处理中的请求，其头已被排入队列。通过使用 `setHeader(name, value)` , `getHeader(name)` , `removeHeader(name)` API，请求头仍然是可变的。实际的头信息将与第一个数据块一起发送，或在调用 request.end() 时发送。

在 `'response'` 事件期间，我们可以为响应对象添加监听器；尤其是监听 `'data'` 事件。

```js
res.on('data', (chunk) => {
    //do something
});
```

设置 `Content-Length` 标头可限制响应正文的大小。如果 `response.strictContentLength` 设置为 true ，与 Content-Length 头值不匹配将导致 Error 抛出，由 `code: 'ERR_HTTP_CONTENT_LENGTH_MISMATCH'` 标识。

Content-Length 值的单位应该是字节，而不是字符。使用 `Buffer.byteLength()` 以字节为单位确定正文的长度。