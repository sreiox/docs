---
outline: deep
---

## async_hooks

这些类用于关联状态并在整个回调和 promise 链中传播它。它们允许在 Web 请求的整个生命周期或任何其他异步持续时间内存储数据。它类似于其他语言中的线程本地存储。

AsyncLocalStorage 和 AsyncResource 类是 node:async_hooks 模块的一部分：
```js
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
```

>AsyncLocalStorage 主要用于在异步操作中传递和存储上下文信息，以便在整个异步调用链中共享这些信息。它适用于以下情况：

>- 跨异步操作共享数据：当需要在异步操作之间共享数据时，例如在一个 HTTP 请求处理过程中，可能会涉及到多个异步操作（例如数据库查询、文件读取等），这时可以使用 AsyncLocalStorage 来传递请求上下文，以便在整个请求处理过程中共享数据。

>- 请求范围的数据传递：在服务端应用中，通常会为每个请求创建一个独立的上下文环境，包含了请求的相关信息（例如请求 ID、用户信息等）。这些信息可能在整个请求处理过程中需要被多个异步操作访问到，这时可以使用 AsyncLocalStorage 来传递和存储这些请求范围的数据。

>- 日志记录：在日志记录中，可能需要在异步操作之间传递一些额外的上下文信息，例如请求 ID、用户信息等。使用 AsyncLocalStorage 可以方便地在整个日志记录过程中共享这些上下文信息。

>- 跟踪调试：在调试异步代码时，可能需要跟踪一些上下文信息，例如某个异步操作的调用链、参数等。使用 AsyncLocalStorage 可以方便地在整个调试过程中共享这些信息，帮助定位问题。

>总的来说，AsyncLocalStorage 主要用于在异步操作中传递和存储上下文信息，以实现数据共享和跟踪。它可以帮助在异步编程中更加灵活和可靠地管理上下文信息。


### AsyncLocalStorage

以下示例使用 AsyncLocalStorage 构建一个简单的日志器，它为传入的 HTTP 请求分配 ID，并将它们包含在每个请求中记录的消息中。

```js
const http = require('node:http');
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish
```
AsyncLocalStorage 的每个实例都维护一个独立的存储上下文。多个实例可以安全地同时存在，而不会有干扰彼此数据的风险。

#### new AsyncLocalStorage()

创建 AsyncLocalStorage 的新实例。Store 仅在 run() 调用内或 enterWith() 调用后提供。

##### AsyncLocalStorage.bind(fn)

- fn `<Function>` 绑定到当前执行上下文的函数。

- 返回：`<Function>` 在捕获的执行上下文中调用 fn 的新函数。

将给定函数绑定到当前执行上下文。
```js
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

async function fetchData() {
  // 使用 bind 方法绑定上下文数据
  asyncLocalStorage.bind({ requestId: '123456' }, async () => {
    // 在异步操作中获取共享的上下文数据
    const context = asyncLocalStorage.getStore();
    console.log('Request ID:', context.requestId);

    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 在异步操作中再次获取共享的上下文数据
    const updatedContext = asyncLocalStorage.getStore();
    console.log('Updated Request ID:', updatedContext.requestId);
  });
}

// 调用 fetchData 函数
fetchData();
```
##### AsyncLocalStorage.snapshot() ???????不懂

##### asyncLocalStorage.disable()

`禁用 AsyncLocalStorage 的实例`。对 asyncLocalStorage.getStore() 的所有后续调用都将返回 undefined，直到再次调用 asyncLocalStorage.run() 或 asyncLocalStorage.enterWith()。

调用 asyncLocalStorage.disable() 时，将退出所有当前链接到该实例的上下文。

##### asyncLocalStorage.getStore()

返回当前存储。如果在通过调用 asyncLocalStorage.run() 或 asyncLocalStorage.enterWith() 初始化的异步上下文之外调用，它将返回 undefined。

##### asyncLocalStorage.enterWith(store) ???????不懂

- store `<any>`

转换为当前同步执行的剩余部分的上下文，然后通过任何后续异步调用持久保存存储。

##### asyncLocalStorage.run(store, callback[, ...args])

在上下文中同步运行函数并返回其返回值。在回调函数之外无法访问该存储。在回调中创建的任何异步操作都可以访问该存储。

如果回调函数抛出错误，则 run() 也会抛出该错误。堆栈跟踪不受此调用的影响，上下文已退出。

##### asyncLocalStorage.exit(callback[, ...args])

### AsyncResource

AsyncResource 类旨在通过嵌入器的异步资源进行扩展。使用它，用户可以轻松触发自己资源的生命周期事件。

#### new AsyncResource(type[, options])

### 后续待更新...