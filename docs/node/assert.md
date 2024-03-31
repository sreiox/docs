---
outline: deep
---

## Assert

node:assert 模块提供了一组用于验证不变量的断言函数

在严格断言模式下，非严格方法的行为与其对应的严格方法相同。例如，assert.deepEqual() 的行为类似于 assert.deepStrictEqual()。

使用严格断言模式：

```js
const assert = require('node:assert').strict;
//const assert = require('node:assert/strict');
try {
    assert.deepEqual([[1,2,3], 3], [[1,2,'3'],3], 'bufu')
} catch (error) {
    console.error('AssertionError:', error)
}
```

### assert.AssertionError

表示断言的失败。node:assert 模块抛出的所有错误都是 AssertionError 类的实例。

- options `<Object>`
    - message `<string>` 如果提供，则错误消息将设置为此值。
    - actual ``<any>`` 错误实例上的 actual 属性。
    - expected `<any>` 错误实例上的 expected 属性。
    - operator `<string>` 错误实例上的 operator 属性。
    - stackStartFn `<Function>` 如果提供，则生成的堆栈跟踪将省略此函数之前的帧。

Error 的子类，表示断言的失败。
所有实例都包含内置的 Error 属性（message 和 name），以及：
    - actual `<any>` 对于 assert.strictEqual() 等方法，设置为 actual 参数。
    - expected `<any>` 对于 assert.strictEqual() 等方法，设置为 expected 值。
    - generatedMessage `<boolean>` 指示消息是否是自动生成的 (true)。
    - code `<string>` 值始终为 ERR_ASSERTION，以表明该错误是断言错误。
    - operator `<string>` 设置为传入的运算符值。

自定义使用

```JS
function myCustomAssertion(condition, message){
    if(!condition){
        throw new assert.AssertionError({
            message: message || 'assertion failed',
            actual: condition,
            expected: true,
            operator: '==='
        })
    }
    
}

try {
    myCustomAssertion(false, 'custom assertion failed')
} catch (error) {
    console.error(error)
}

// AssertionError [ERR_ASSERTION]: custom assertion failed
//     at new AssertionError (node:internal/assert/assertion_error:466:5)
//     at myCustomAssertion (/Users/weidada/dnmp/www/xmm/vitepress/node/assert.js:17:15)
//     at Object.<anonymous> (/Users/weidada/dnmp/www/xmm/vitepress/node/assert.js:28:5)
//     at Module._compile (node:internal/modules/cjs/loader:1103:14)
//     at Object.Module._extensions..js (node:internal/modules/cjs/loader:1157:10)
//     at Module.load (node:internal/modules/cjs/loader:981:32)
//     at Function.Module._load (node:internal/modules/cjs/loader:822:12)
//     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)
//     at node:internal/main/run_main_module:17:47 {
//   generatedMessage: false,
//   code: 'ERR_ASSERTION',
//   actual: false,
//   expected: true,
//   operator: '==='
// }
```

### assert(value[, message])

检查为真的输入

```js
assert('', 'sha')
```

### assert.deepEqual(actual, expected[, message])[https://nodejs.cn/api/assert.html#%E6%AF%94%E8%BE%83%E8%AF%A6%E6%83%85]

严格断言模式

`assert.deepStrictEqual()` 的别名。

### assert.deepStrictEqual(actual, expected[, message])[https://nodejs.cn/api/assert.html#%E6%AF%94%E8%BE%83%E8%AF%A6%E6%83%85]

### assert.doesNotMatch(string, regexp[, message])

期望 string 输入与正则表达式不匹配。

如果值匹配，或者 string 参数的类型不是 string，则抛出 AssertionError，其 message 属性设置为等于 message 参数的值。如果未定义 message 参数，则分配默认错误消息。如果 message 参数是 Error 的实例，则将抛出错误而不是 AssertionError。

### assert.doesNotReject(asyncFn[, error][, message])

- asyncFn `<Function> | <Promise>`
- error `<RegExp> | <Function>`
- message `<string>`

等待 asyncFn promise，或者，如果 asyncFn 是函数，则立即调用该函数并等待返回的 promise 完成。然后会`检查 promise 是否没有被拒绝`。

### assert.doesNotThrow(fn[, error][, message])

### assert.equal(actual, expected[, message])

严格断言模式

`assert.strictEqual()` 的别名。

### assert.fail([message])
- message `<string> | <Error>` 默认值：'Failed'

抛出带有提供的错误消息或默认错误消息的 AssertionError。如果 message 参数是 Error 的实例，则将抛出错误而不是 AssertionError。

```js
const assert = require('node:assert/strict');

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```

### assert.ifError(value)
- value `<any>`

`如果 value 不是 undefined 或 null，则抛出 value。`这在回调中测试 error 参数时很有用。堆栈跟踪包含来自传给 ifError() 的错误的所有帧，包括 ifError() 本身的潜在新帧。

```js
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
```

### assert.match(string, regexp[, message])

### assert.notDeepEqual(actual, expected[, message])

严格断言模式

`assert.notDeepStrictEqual()` 的别名。

### assert.notDeepStrictEqual(actual, expected[, message])

### assert.notEqual(actual, expected[, message])

严格断言模式

`assert.notStrictEqual()` 的别名。

### assert.notStrictEqual(actual, expected[, message])

### assert.ok(value[, message])

### assert.rejects(asyncFn[, error][, message])

### assert.strictEqual(actual, expected[, message])

### assert.throws(fn[, error][, message])

期望函数 fn 抛出错误。