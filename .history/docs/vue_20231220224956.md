# vue

## 1. 虚拟DOM

采用`虚拟DOM`的更新技术在性能这块，理论上是不可能比原生Js操作DOM高的。不过在大部分情况下，开发者很难写出绝对优化的命令式代码。所以虚拟DOM就是用来解决这一问题，让开发者系的代码在性能上得到保障，甚至无限接近命令式代码的性能。

虚拟DOM（Virtual DOM）是一种在Web开发中常用的概念。它是基于JavaScript对象的表示，用于描述真实DOM（Document Object Model）的层次结构和状态。

在传统的Web开发中，直接操作真实DOM是比较昂贵的操作，因为每次更新都需要重新计算布局和重新渲染。而虚拟DOM的思想是，通过创建一个轻量级的JavaScript对象树来模拟真实DOM的结构和状态。在组件或数据发生变化时，先对虚拟DOM进行操作和计算，`通过diff算法来计算出最小的变更`，然后将变化应用到真实DOM上，通过对应的渲染器，来渲染到页面上。这样可以减少对真实DOM的直接操作，提高性能和效率。


同时`虚拟DOM`也为跨平台开发提供了极大的便利，开发者写的同一套代码（有些需要针对不同平台做区分），通过不同的渲染规则，就可以生成不同平台的代码。

在`vue`中会通过`渲染器`来将虚拟DOM转换为对应平台的真实DOM。如`renderer(vnode， container)`，该方法会根据`vnode`描述的信息（如tag、props、children）来创建DOM元素，根据规则为对应的元素添加属性和事件，`处理vnode下的children`。

虚拟DOM的工作流程一般包括以下几个步骤：
1. `初始化`：将真实DOM的结构和状态转化为虚拟DOM的JavaScript对象表示。
2. `渲染`：根据虚拟DOM的JavaScript对象创建真实DOM树，并将其插入到文档中。
3. `更新`：当组件或数据发生变化时，对比新旧虚拟DOM的差异，生成更新操作序列。
4. `应用更新`：根据更新操作序列，将变化应用到真实DOM上，更新页面显示。

虚拟DOM的优势在于它可以提供更高效的DOM操作和渲染，减少直接操作真实DOM所带来的性能损耗。同时，虚拟DOM也提供了一种抽象层，使得开发者可以更方便地对组件进行操作和管理。

## 2. vue3的变化（改进）

- 响应式方面
    `vue3`的响应式是基于`Proxy`来实现的，利用`代理来拦截对象`的基本操作，配合`Refelect.*`方法来完成响应式的操作。
- 书写方面
    提供了`setup`的方式，配合`组合式API`，可以建立组合逻辑、创建响应式数据、创建通用函数、注册生命周期钩子等
- diff算法方面:
    - 在`vue2`中使用的是`双端diff`算法：是一种`同时比较新旧两组节点的两个端点的算法`（比头、比尾、头尾比、尾头比）。一般情况下，先找出变更后的头部，再对剩下的进行双端diff。
    - 在`vue3`中使用的是`快速diff`算法：它借鉴了文本diff算法的预处理思路，先处理新旧两组节点中相同的前置节点和后置节点。当前置节点和后置节点全部处理完毕后，如果`无法通过简单的挂载新节点或者卸载已经不存在的节点来更新`，则需要根据`节点间的索引关系`，构造出一个最长递增子序列。最长递增子序列所指向的节点即为不需要移动的节点。
- 编译上的优化
    - `vue3`新增了`PatchFlags`来标记节点类型（动态节点收集与补丁标志），会在一个`Block`维度下的`vnode`下收集到对应的`dynamicChildren`（动态节点），在执行更新时，忽略`vnode`的`children`，去直接找到`动态节点数组`进行更新，这是一种高效率的`靶向更新`。
    - `vue3`提供了静态提升方式来`优化重复渲染静态节点`的问题，结合静态提升，还对静态节点进行`预字符串化`，减少了虚拟节点的性能开销，降低了内存占用。
    - `vue3`会将`内联事件进行缓存`，每次渲染函数重新执行时会优先取缓存里的事件

## 3. 关于vue3双向绑定的实现

`vue3`实现双向绑定的核心是`Proxy`（代理的使用），它会对需要`响应式处理的对象进行一层代理`，对象的所有操作（get、set等）都会被Prxoy代理到。在vue中，所有响应式对象相关的副作用函数会使用`weakMap`来存储。当执行对应的操作时，会去执行操作中所收集到的副作用函数。

```js
// WeakMap常用于存储只有当key所引用的对象存在时（没有被回收）才有价值的消息，十分贴合双向绑定场景
const bucket = new WeakMap(); // 存储副作用函数

let activeEffect; // 用一个全局变量处理被注册的函数

const tempObj = {}; // 临时对象，用于操作

const data = { text: "hello world" }; // 响应数据源

// 用于清除依赖
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

// 处理依赖函数
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    fn();
  };
  effectFn.deps = [];
  effectFn();
}

// 在get时拦截函数调用track函数追踪变化
function track(target, key) {
  if (!activeEffect) return; //
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  deps.add(activeEffect);

  activeEffect.deps.push(deps);
}

// 在set拦截函数内调用trigger来触发变化
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set(effects);
  effectsToRun.forEach(effectFn => effectFn());
  // effects && effects.forEach(fn => fn());
}

const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    if (!activeEffect) return; //
    console.log("get -> key", key);
    track(target, key);
    return target[key];
  },

  // 拦截设置操作
  set(target, key, newValue) {
    console.log("set -> key: newValue", key, newValue);
    target[key] = newValue;
    trigger(target, key);
  },
});

effect(() => {
  tempObj.text = obj.text;
  console.log("tempObj.text :>> ", tempObj.text);
});

setTimeout(() => {
  obj.text = "hi vue3";
}, 1000);
```

## 4. vue3中的ref、toRef、toRefs

- ref:接收一个内部值，生成`对应的响应式数据`，该内部值挂载在`ref对象`的`value`属性上；该对象可以用于模版和`reactive`。使用ref是为了解决值类型在`setup`、`computed`、`合成函数`等情况下的响应式丢失问题。
- toRef:为`响应式对象`（reactive）的`一个属性创建对应的ref`，且该方式创建的`ref与源属性保持同步`。
- toRefs：将`响应式对象`转换成`普通对象`，对象的`每个属性`都是`对应的ref`，两者间保持同步。使用`toRefs进行对象解构`。

```js
function ref(val) {
    const wrapper = {value: val}
    Object.defineProperty(wrapper, '__v_isRef', {value: true})
    return reactive(wrapper)
}

function toRef(obj, key) {
    const wrapper = {
        get value() {
            return obj[key]
        },
        set value(val) {
            obj[key] = val
        }
    }
    Object.defineProperty(wrapper, '__v_isRef', {value: true})
    return wrapper
}

function toRefs(obj) {
    const ret = {}
    for (const key in obj) {
        ret[key] = toRef(obj, key)
    }
    
    return ret
}

// 自动脱ref
function proxyRefs(target) {
    return new Proxy(target, {
        get(target, key, receiver) {
            const value = Reflect.get(target, key, receiver)
            return value.__v_isRef ? value.value : value
        },
        set(target, key, newValue, receiver) {
            const value = target[key]
            if(value.__v_isRef) {
                value.value = newValue
                return true
            }
            return Reflect.set(target, key, newValue, receiver)
        }
    })
}
```

## 5. computed和watch的区别

- 使用场景：`computed`适用于一个数据受多个数据影响使用；`watch`适合一个数据影响多个数据使用。
- 区别：`computed属性默认会走缓存，只有依赖数据发生变化，才会重新计算，不支持异步，有异步导致数据发生变化时，无法做出相应改变；watch不依赖缓存，一旦数据发生变化就直接触发响应操作，支持异步。`

## 6. composition Api对比 option Api的优势

- 所有`API都是import`引入的用到的 功能都import进来，对`Tree- shaking`很友好，没用到功能，打包的时候会被清理掉，减小包的大小。
- 不再上下反复横跳，我们可以把一个功能模 块的methods、data 都放在一起书写，维护更轻松。
- 代码方便复用，可以把一个功能所有的 methods、data 封装在一个独立的函数里，复用代码非常容易。
- Composotion API新增的return 等语句， 在实际项目中使用（啥意思?）



