# 手写题

## 手写一个深拷贝

```js
function deepClone(obj){
    if(typeof obj !== 'object' || typeof obj === null) return obj;

    const result = obj instanceof Array? []: {}

    for(let key in obj){

        result[key] = deepClone(obj[key])
        //浅拷贝 resutl[key] = obj[key]
    } 
    return result;
}

const obj = {a: 1, b: {c:3}, d: 5}
const objClone = deepClone(obj)
obj.a = 123
console.log(obj) //{a: 123, b: {…}, d: 5}
console.log(objClone) //{a: 1, b: {…}, d: 5}
```

## 手写防抖和节流函数

### 防抖


#### 停止触发事件n毫秒后执行回调函数

触发事件后函数不会立即执行，而是在停止事件触发后 n 毫秒后执行，如果在 n 毫秒内又触发了事件，则会重新计时

```js
function debounce(fn, delay){
    let timer = null;

    return function(){

        if(timer) clearTimeout(timer)

        timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
        }, delay)
    }
}
```

#### 触发事件后立即执行回调函数，但是触发后n毫秒内不会再执行回调函数，如果 n 毫秒内触发了事件，也会重新计时。

```js
function debounce(fn, delay){
    let timer;

    return function(){

        let isImmediate = !timer

        if(timer) clearTimeout(timer)
        
        timer = setTimeout(() => {
            timer = null
        }, delay)

        if(isImmediate) {
            fn.apply(this, arguments)
            
        }
    }
}
```
举个例子来对比一下两个版本的区别：

```js
document.body.onclick= debounce(function () { console.log('hello') },1000)

```
如上代码中，我们给body添加了一个点击事件监听器。

如果是版本1的防抖函数，当我点击body时，控制台不会立即打印hello,要等 1000ms 后才会打印。在这 1000s 内如果还点击了 body，那么就会重新计时。即最后一次点击 body 过1000ms后控制台才会打印hello

如果是版本2的防抖函数，当我首次点击body时，控制台会立马打印 hello，但是在此之后的 1000ms 内点击 body ，控制台不会有任何反应。在这 1000s 内如果还点击了 body，那么就会重新计时。必须等计时结束后再点击body，控制台才会再次打印 hello。

### 节流

#### 使用定时器

```js
function throttle(fn, delay){
    let timer;

    return function(){

        if(timer) return

        timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null;
            clearTimeout(timer)
        }, delay)
    }
}
```
#### 计算当前时间与上次执行函数时间的间隔

```js
function throttle(fn, dalay){
    let previous = 0;

    return function(){

        let now = Date.now()

        if(now - previous > delay){
            fn.apply(this, arguments)
            previous = now
        }
    }
}
```
## 手写快速排序

```js
function quickSort(arr: number[], startIndex = 0): number[] { 
    if(arr.length <= 1) return arr
    const left: number[] = [], right: number[] = [];
    const startNum = arr.splice(startIndex, 1)[0]
    for(let i = 0; i < arr.length; i++){
        if(arr[i] < startNum){
            left.push(arr[i])
        }else{
            right.push(arr[i])
        }
    }
    return [...quickSort(left), startNum, ...quickSort(right)]
}
```

## 输入为两个一维数组，将这两个数组合并，去重，不要求排序，返回一维数组

```js
function dealArr(arr: any[], arr2: any[]): any[] {
    Array.from(new Set([...arr.flat(), ...arr2.flat()]))
}
```

## 编写函数convert(money) ，传入金额，将金额转换为千分位表示法。ex:-87654.3 => -87,654.3

```js
function convert(money: number): string {
    let result: string[] = []
    let tail: string = ''
    let negativeFlag: string = ""
    let arr: string[] = [...String(money)]

    if(arr[0] === '-') {
        negativeFlag = '-'
        arr.shift(0, 1)
    }

    let dotIndex: number = arr.indexOf('.')

    if(dotIndex !== -1){
        tail = arr.splice(dotIndex, arr.length - dotIndex).join("")
    }

    let reverseArr: string[] = arr.reverse()
    for(let i = 0; i < reverseArr.length; i++){
        if((i+1)%3 === 0 && i < reverseArr.length){
            result[i] = ',' + reverseArr[i]
        }else{
            result[i] = reverseArr[i]
        }
    }
    return negativeFlag + result.reverse().join("") + tail
}
```
## 实现一个类似关键字new功能的函数

在js中new关键字主要做了：首先创建一个空对象，这个对象会作为执行new构造函数之后返回的对象实例，将创建的空对象原型（__proto__）指向构造函数的prototype属性，同时将这个空对象赋值给构造函数内部的this，并执行构造函数逻辑，根据构造函数的执行逻辑，返回初始创建的对象或构造函数的显式返回值。

```js
function newFn(...args){
    const constructor = args.shift()
    const obj = Object.create(constructor.prototype)
    const result = constructor.apply(obj, args)
    return typeof result === 'object' && result !== null? result: obj
}

function person(name){
    this.name = name
}
const p = newFn(person, 'john')
console.log(p.name)
```

## [手写Promise](https://juejin.cn/post/6850037281206566919#heading-6)

我们先来回顾下最简单的 Promise 使用方式：

```js
const p1 = new Promise((resolve, reject) => {
  console.log('create a promise');
  resolve('成功了');
})

console.log("after new promise");

const p2 = p1.then(data => {
  console.log(data)
  throw new Error('失败了')
})

const p3 = p2.then(data => {
  console.log('success', data)
}, err => {
  console.log('faild', err)
})
```

控制台输出:

```js
"create a promise"
"after new promise"
"成功了"
"faild Error: 失败了"
```

- 首先我们在调用 Promise 时，会返回一个 `Promise 对象`。
- 构建 Promise 对象时，需要传入一个 `executor` 函数，Promise 的主要业务流程都在 executor 函数中执行。
- 如果运行在 excutor 函数中的业务执行`成功`了，会调用 `resolve` 函数；如果执行`失败`了，则调用 `reject `函数。
- `Promise 的状态不可逆`，同时调用 `resolve` 函数和 `reject` 函数，默认会采取第一次调用的结果。

以上简单介绍了 Promise 的一些主要的使用方法，结合 `Promise/A+` 规范，我们可以分析出 Promise 的基本特征：

> 1. `promise` 有三个状态：`pending`，`fulfilled`，or `rejected`；「规范 Promise/A+ 2.1」
> 2. `new promise`时， 需要传递一个`executor()`执行器，执行器`立即执行`；
> 3. `executor`接受两个参数，分别是`resolve`和`reject`；
> 4. `promise` 的默认状态是 `pending`；
> 5. `promise` 有一个`value`保存成功状态的值，可以是`undefined/thenable/promise`；「规范 Promise/A+ 1.3」
> 6. `promise` 有一个`reason`保存失败状态的值
> 7. `promise` 只能从`pending`到`rejected`, 或者从`pending`到`fulfilled`，状态`一旦确认`，就`不会再改变`；
> 8. `promise` 必须有一个`then`方法，then 接收两个参数，分别是 `promise` 成功的回调 `onFulfilled`, 和 `promise` 失败的回调 `onRejected`；「规范 Promise/A+ 2.2」
> 9. 如果调用 `then` 时，`promise` 已经`成功`，则执行`onFulfilled`，参数是`promise`的`value`
> 10. 如果调用 `then `时，`promise` 已经`失败`，那么执行`onRejected`, 参数是`promise`的`reason`；
> 11. 如果 `then` 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 `then` 的失败的回调`onRejected`；

按照上面的特征，我们试着勾勒下 Promise 的形状：

```js
// 三个状态：PENDING、FULFILLED、REJECTED
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

class Promise {
    constructor(exector){
        // 默认状态为 PENDING
        this.status = PROMISE_STATUS_PENDING
        // 存放成功状态的值，默认为 undefined
        this.value = undefined
        // 存放失败状态的值，默认为 undefined
        this.reason = undefined

        // 调用此方法就是成功
        let resolve  = value => {
            //状态为pending时状态才可以更新，防止excetor中调用了两次 resolve/reject 方法？
            if(this.status === PROMISE_STATUS_PENDING){
                this.status = PROMISE_STATUS_FULFILLED
                this.value = value
            }
        }

        //调用此方法就是失败
        let reject = reason => {
            //状态为pending时状态才可以更新，防止excetor中调用了两次 resolve/reject 方法？
            if(this.status === PROMISE_STATUS_PENDING){
                this.staus = PROMISE_STATUS_REJECTED
                this.reason = reason
            }
        }

        try {
            excetor(resolve, reject)
        } catch(error) {
            reject(error)
        }
    }

    then(onFulfilled, onRejected){
        if(this.status === PROMISE_STATUS_FULFILLED){
            onFulfilled(this.value)
        }

        if(this.status === PROMISE_STATUS_REJECTED){
            onRejected(this.reason)
        }
    }
}
```

写完代码我们可以测试一下：

```js
const promise = new Promise((resolve, reject) => {
  resolve('成功');
}).then(
  (data) => {
    console.log('success', data)
  },
  (err) => {
    console.log('faild', err)
  }
)
```

控制台输出：

```js
"success 成功"
```

现在我们已经实现了一个基础版的 Promise，但是还不要高兴的太早噢，这里我们只处理了同步操作的 promise。如果在 executor()中传入一个异步操作的话呢，我们试一下：

```js
const promise = new Promise((resolve, reject) => {
  // 传入一个异步操作
  setTimeout(() => {
    resolve('成功');
  },1000);
}).then(
  (data) => {
    console.log('success', data)
  },
  (err) => {
    console.log('faild', err)
  }
)
```

执行测试脚本后发现，promise 没有任何返回。

因为 promise 调用 then 方法时，当前的 `promise 并没有成功`，一直处于 `pending` 状态。所以如果当调用 then 方法时，当前状态是 pending，我们需要`先将成功和失败的回调分别存放起来`，在executor()的异步任务被执行时，触发 resolve 或 reject，依次调用成功或失败的回调。

```js
// 三个状态：PENDING、FULFILLED、REJECTED
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

class Promise {
    constructor(exector){
        // 默认状态为 PENDING
        this.status = PROMISE_STATUS_PENDING
        // 存放成功状态的值，默认为 undefined
        this.value = undefined
        // 存放失败状态的值，默认为 undefined
        this.reason = undefined
        // 存放成功的回调
        this.onFulfilledFns = []
        // 存放失败的回调
        this.onRejectedFns = []

        // 调用此方法就是成功
        let resolve  = value => {
            //状态为pending时状态才可以更新，防止excetor中调用了两次 resolve/reject 方法？
            if(this.status === PROMISE_STATUS_PENDING){
                this.status = PROMISE_STATUS_FULFILLED
                this.value = value
                // 依次将对应的函数执行
                this.onFulfilledFns.forEach(fn => fn())
            }
        }

        //调用此方法就是失败
        let reject = reason => {
            //状态为pending时状态才可以更新，防止excetor中调用了两次 resolve/reject 方法？
            if(this.status === PROMISE_STATUS_PENDING){
                this.staus = PROMISE_STATUS_REJECTED
                this.reason = reason
                // 依次将对应的函数执行
                this.onRejectedFns.forEach(fn => fn())
            }
        }

        try {
            excetor(resolve, reject)
        } catch(error) {
            reject(error)
        }
    }

    then(onFulfilled, onRejected){
        if(this.status === PROMISE_STATUS_FULFILLED){
            onFulfilled(this.value)
        }

        if(this.status === PROMISE_STATUS_REJECTED){
            onRejected(this.reason)
        }

        if(this.status === PROMISE_STATUS_PENDING){
            // 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
            this.onFulfilledFns.push(() => onFulfilled(this.value))

            // 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
            this.onRejectedFns.push(() => onRejected(this.reason))
        }
    }
}
```

此时上面结果输出：

```js
"success 成功"
```

熟悉设计模式的同学，应该意识到了这其实是一个`发布订阅模式`，这种`收集依赖` -> `触发通知` -> `取出依赖执行的方式`，被广泛运用于发布订阅模式的实现。

### then 的链式调用&值穿透特性

我们都知道，promise 的优势在于可以链式调用。在我们使用 Promise 的时候，当 then 函数中 `return` 了一个值，不管是什么值，我们都能在下一个 then 中获取到，这就是所谓的`then 的链式调用`。而且，当我们不在 then 中放入参数，例：`promise.then().then()`，那么其后面的 then 依旧可以`得到之前 then 返回的值`，这就是所谓的`值的穿透`。那具体如何实现呢？简单思考一下，如果每次调用 then 的时候，我们都重新创建一个 promise 对象，并把上一个 then 的返回结果传给这个新的 promise 的 then 方法，不就可以一直 then 下去了么？那我们来试着实现一下。这也是手写 Promise 源码的重中之重，所以，打起精神来，重头戏来咯！

有了上面的想法，我们再结合 Promise/A+ 规范梳理一下思路：

> 1. then 的参数 onFulfilled 和 onRejected 可以缺省，如果 onFulfilled 或者 onRejected不是函数，将其忽略，且依旧可以在下面的 then 中获取到之前返回的值；「规范 Promise/A+ 2.2.1、2.2.1.1、2.2.1.2」
> 2. promise 可以 then 多次，每次执行完 promise.then 方法后返回的都是一个“新的promise"；「规范 Promise/A+ 2.2.7」
> 3. 如果 then 的返回值 x 是一个普通值，那么就会把这个结果作为参数，传递给下一个 then 的成功的回调中；
> 4. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调中；「规范 Promise/A+ 2.2.7.2」
> 5. 如果 then 的返回值 x 是一个 promise，那么会等这个 promise 执行完，promise 如果成功，就走下一个 then 的成功；如果失败，就走下一个 then 的失败；如果抛出异常，就走下一个 then 的失败；「规范 Promise/A+ 2.2.7.3、2.2.7.4」
> 6. 如果 then 的返回值 x 和 promise 是同一个引用对象，造成循环引用，则抛出异常，把异常传递给下一个 then 的失败的回调中；「规范 Promise/A+ 2.3.1」
> 7. 如果 then 的返回值 x 是一个 promise，且 x 同时调用 resolve 函数和 reject 函数，则第一次调用优先，其他所有调用被忽略；「规范 Promise/A+ 2.3.3.3.3」

我们将代码补充完整：

```js
// 三个状态：PENDING、FULFILLED、REJECTED
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

const resolvePromise = (promise2, x, resolve, reject) => {
    // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise  Promise/A+ 2.3.1
    if(promise2 === x) return reject(new TypeError('Chaining cycle detected for promise'))
    // Promise/A+ 2.3.3.3.3 只能调用一次
    let called
    // 后续的条件要严格判断 保证代码能和别的库一起使用
    if((typeof x === 'object' && typeof x !== null) || typeof x === 'function'){
        try {
            // 为了判断 resolve 过的就不用再 reject 了（比如 reject 和 resolve 同时调用的时候）  Promise/A+ 2.3.3.1
            let then = x.then
            if(typeof x === 'function'){
                // 不要写成 x.then，直接 then.call 就可以了 因为 x.then 会再次取值，Object.defineProperty  Promise/A+ 2.3.3.3
                then.call(x, y => {// 根据 promise 的状态决定是成功还是失败
                    if(called) return
                    called = true
                    // 递归解析的过程（因为可能 promise 中还有 promise） Promise/A+ 2.3.3.3.1
                    resolvePromise(promise2, y, resolve, reject)
                }, r => {// 只要失败就失败 Promise/A+ 2.3.3.3.2
                    if(called) return
                    called = true
                    reject(r)
                })
            }else{
                resolve(x)
            }
        } catch(e) {
            if (called) return;
            called = true
            reject(e)
        }
    }else{
        // 如果 x 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.4  
        reject(x)
    }


}

class Promise {
    constructor(exector){
        // 默认状态为 PENDING
        this.status = PROMISE_STATUS_PENDING
        // 存放成功状态的值，默认为 undefined
        this.value = undefined
        // 存放失败状态的值，默认为 undefined
        this.reason = undefined
        // 存放成功的回调
        this.onFulfilledFns = []
        // 存放失败的回调
        this.onRejectedFns = []

        // 调用此方法就是成功
        let resolve  = value => {
            //状态为pending时状态才可以更新，防止excetor中调用了两次 resolve/reject 方法？
            if(this.status === PROMISE_STATUS_PENDING){
                this.status = PROMISE_STATUS_FULFILLED
                this.value = value
                // 依次将对应的函数执行
                this.onFulfilledFns.forEach(fn => fn())
            }
        }

        //调用此方法就是失败
        let reject = reason => {
            //状态为pending时状态才可以更新，防止excetor中调用了两次 resolve/reject 方法？
            if(this.status === PROMISE_STATUS_PENDING){
                this.staus = PROMISE_STATUS_REJECTED
                this.reason = reason
                // 依次将对应的函数执行
                this.onRejectedFns.forEach(fn => fn())
            }
        }

        try {
            excetor(resolve, reject)
        } catch(error) {
            reject(error)
        }
    }

    then(onFulfilled, onRejected){
        //解决 onFufilled，onRejected 没有传值的问题
        //Promise/A+ 2.2.1 / Promise/A+ 2.2.5 / Promise/A+ 2.2.7.3 / Promise/A+ 2.2.7.4
        onFulfilled = typeof onFulfilled === 'function'? onFulfilled: v => v
        //因为错误的值要让后面访问到，所以这里也要跑出个错误，不然会在之后 then 的 resolve 中捕获
        onRejected = typeof onRejected === 'function'? onRejected: err => { throw err }
        // 每次调用 then 都返回一个新的 promise  Promise/A+ 2.2.7
        let promise2 = new Promise((resolve, reject) => {
            if(this.status === PROMISE_STATUS_FULFILLED){
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        // x可能是一个proimise
                        resolvePromise(promise2, x, resolve, reject)
                    }catch(e){
                        reject(e)
                    }
                }, 0)
            }

            if(this.status === PROMISE_STATUS_REJECTED){
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        // x可能是一个proimise
                        resolvePromise(promise2, x, resolve, reject)
                    }catch(e){
                        reject(e)
                    }
                }, 0)
            }

            if(this.status === PROMISE_STATUS_PENDING){
                // 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
                this.onFulfilledFns.push(() => {
                    setTimeout(() => {
                        try{
                            let x = onFulfilled(this.value)
                            resovePromise(promise2, x, resolve, reject)
                        }catch(e){
                            reject(e)
                        }
                    }, 0)
                })

                // 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
                this.onRejectedFns.push(() => {
                    setTimeout(() => {
                        try{
                            let x = onRejected(this.reason)
                            resovePromise(promise2, x, resolve, reject)
                        }catch(e){
                            reject(e)
                        }
                    }, 0)
                })
            }
        })
    
    }
}
```