---
outline: deep
---

## 文件系统

要使用基于 promise 的 API：

```js
const fs = require('node:fs/promises');
```
要使用回调和同步的 API：

```js
const fs = require('node:fs');
```

所有文件系统操作都具有同步、回调和基于 promise 的形式，并且可以使用 CommonJS 语法和 ES6 模块进行访问。

### Promise 示例

基于 promise 的操作会返回一个当异步操作完成时被履行的 promise。

```js
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello');
```

### 回调示例

回调的形式将完成回调函数作为其最后一个参数并且异步地调用该操作。传给完成回调的参数取决于方法，但是第一个参数始终预留用于异常。如果操作成功地完成，则第一个参数为 null 或 undefined。

```js
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

当需要最大性能（在执行时间和内存分配方面）时，node:fs 模块 API 的基于回调的版本比使用 promise API 更可取。

### 同步示例

同步的 API 会阻塞 Node.js 事件循环和下一步的 JavaScript 执行，直到操作完成。异常会被立即地抛出，可以使用 try…catch 来处理，也可以允许冒泡。

```js
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```
