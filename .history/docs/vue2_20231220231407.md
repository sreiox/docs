# vue2

## 0. 原理解读

### defineProperty/get/set

```js
//Object.defineProperty(obj, 'foo', {configurable: true, writable: true, enumable: true})
function convert(obj){
    Object.keys(obj).forEach(key => {
        let initalValue = obj[key];
        Object.defineProperty(obj, key, {
            get () {
                return initalValue
            }
            set (newValue) {
                initalValue = newValue
            }
        })
    })
}
```

### 依赖追踪（订阅者模式）

```js
window.Dep = Class Dep {
    constructor(){
        this.subscribers = new Set()
    }

    depend(){
        // 依赖收集
        if(activeUpdate){
            this.subscribers.add(activeUpdate)
        }
    }

    notify(){
        // 通知订阅者执行
        this.subscribers.forEach(sub => sub())
    }
}

let activeUpdate

function autorun(update){
    // activeUpdate本质记录正在执行
    function wrappedUpdate{
        activeUpdate = wrappedUpdate
        update()
        activeUpdate = null
    }

    wrappedUpdate()
}

const dep = new Dep()
autorun(() => {
    dep.depend()
})
```

```js
let state = { count: 0 }
// 首先对象通过defineproperty开启监控
obeserve(state)

autorun(() => {
    console.log(state.count)
})

state.count++
```

## 说一下vue2的生命周期？

1. 创建：
    - beforecreate: 实例创建前, 此阶段的data、methods、computed、watch的数据和方法不能被访问
    - created: 实例创建完成后, 此阶段完成数据监听，可以使用数据、更改数据。无法与Dom进行交互，想要的话可以通过nextTick来访问。
2. 挂载
    - beforeMount: 页面渲染前, 此阶段虚拟Dom已经创建完成，即将开始渲染。在此时也可以对数据进行更改，不会触发updated。
    - mounted: 页面渲染完成后, 此阶段真实Dom渲染完毕，数据完成双向绑定，可以访问到Dom节点，使用$refs属性对Dom进行操作。
3. 更新
    - beforeUpdate: 响应式数据更新前, 此阶段更改数据，不会造成页面重新渲染。
    - updated: 响应式数据更新完成后, 避免在此阶段更改数据，因为这可能会导致无限循环的更新。
4. 销毁
    - beforeDestroy: 实例销毁前, 我们可以在这时进行善后收尾工作，比如清除定时器、解除绑定事件
    - destroyed: 实例销毁完成后
5. 缓存
    - activited: `keep-alive`专属，组件被激活时调用
    - deactivited: keep-alive专属，组件被销毁时调用

### 异步请求放在created还是mounted

首先明确的一个前提是：请求是异步的。

在Created生命周期里Data才生成，而请求返回的数据需要挂载在data上，所以Created里是可以初始化请求的，但是 Created 的这时候DOM还没有初始化；

Mounted生命周期里DOM才初始化渲染完成

如果我们的请求不需要获取/借助/依赖/改变DOM，这时请求可以放在Created

反之则可以放在Mounted里

### 父子组件生命周期执行顺序

组件渲染的顺序是先父后子，渲染完成的顺序是先子后父

组件更新的顺序是先父后子，更新完成的顺序是先子后父

组件销毁的顺序是先父后子，销毁完成的顺序是先子后父

## 1. 什么是Vue以及Vue的特点

vue是一套用于构建用户界面的渐进式（自底向上逐层应用）js框架

1. 组件化开发
2. 无需操作DOM
3. 使用虚拟DOM和diff算法复用DOM节点

## 2. SPA及其优缺点

SPA:signal page application，单一页面应用。

一旦页面加载完成，不会因为用户在浏览器上的操作而进行`跳转`、`刷新`，取而代之的是利用`路由机制实现的HTML内容的变换`、UI和用户的交互，`避免`页面的`重新加载`。

数据需要通过ajax请求获取。

优点：

1. 避免不必要的跳转和重复渲染，提高了用户的体验，减轻了服务器的压力。
2. `前后端分离`，使架构更加清晰。

缺点：

1. 初次加载耗时长（可以通过`按需加载`来避免）。
2. 浏览器的前进后退不可以使用，要自己建立堆栈来进行页面切换。
3. SEO难度大。因为就一个页面。

## 2. v-if和v-show的区别

v-if是真正的条件渲染，`不停地的进行销毁和重建`，但若初始条件为假时，就什么也不做。

v-show无论初始渲染条件是否为真，`都进行渲染`，只是使用“display”属性来控制是否在页面上显示

::: tip
Generally speaking, v-if has higher toggle costs while v-show has higher initial render costs. So prefer v-show if you need to toggle something very often, and prefer v-if if the condition is unlikely to change at runtime.
:::


## 3. [class 和 style如何动态绑定](https://vuejs.org/guide/essentials/class-and-style.html)

都可以通过对象和数组来绑定。

## 4. 怎样理解Vue的单项数据流

父级的prop的更新会向下流动到子级的prop里，但是反过来不可以， 若想反过来，只能通过`$emit`派发一个自定义事件，父组件接到后由父组件修改

## 5. v-for中key的作用？

key代表的是唯一，作用是更高效的更新虚拟dom，diff算法时便于区分新旧虚拟dom，新旧虚拟dom的key相同时不会重新渲染，提高性能

为何不推荐index作为key值：当以数组下标index作为key值时，当其中一个元素发生了变化(增删改查)，就有能导致所有的元素的key值发生改变，导致更新dom时浪费性能

## 说一下组件通信有哪些方式？

1. 父传子
    - 自定义属性 + props：在父组件中，给子组件绑定一个自定义属性，在子组件中，通过props进行接收
    - $parent：直接访问父组件实例的属性和方法
    - $attrs：在父组件中，给子组件绑定一个自定义属性，在子组件中，通过$attrs进行接收【与props不能共存】
    - 插槽
2. 子传父
    - $emit + 自定义事件：在父组件中，给子组件绑定一个自定义事件，绑定事件的值为接收参数的函数，在子组件中，通过$emit发送数据
    - $refs：直接访问子组件实例的属性和方法
    - $children：直接访问子组件实例的属性和方法【返回数组，必须遍历赋值后才能渲染】
3. 祖传孙/孙传祖
    - provide函数传，inject数组收
4. 兄弟间
    - [$bus 全局事件总线：给vue原型添加一个vue实例，用this.$bus.$emit发送，用this.$bus.$on接收](https://stackoverflow.com/questions/68549222/emit-data-with-eventbus)
5. vuex
6. 路由传参
    - params传参（地址栏不显示参数）
    - query传参（地址栏显示参数

## watch和computed的区别

computed计算属性：

- 如果一个数据需要经过复杂计算就用computed
- 支持缓存，只有依赖数据发生改变时，才会重新进行计算
- 不支持异步，当计算属性内有异步操作时，无法监听到数据的变化。原因：定义的函数接收return的结果，return属于同步执行的，是没办法拿到异步请求结果的
- 计算属性只能取不能存，即不能对计算属性直接赋值。如需要存，要给计算属性手动添加setter

watch监听器

- 如果一个数据需要被监听并且对数据做一些异步操作就用watch
- 不支持缓存，数据变化会直接触发相应的操作

## 说一下为什么data是一个函数？

data必须是函数，是为了保证不同组件的`独立性`和`可复用性`，防止不同组件实例间data的引用关系，避免变量污染

## 说一下对keep-alive的理解？

缓存组件，减少请求次数, 需要缓存用户数据类似表单

根据条件缓存页面的方式：

- :include="['组件name']" 指定想要缓存的组件,其他组件不缓存

- :exclude="['组件name']" 指定不想要缓存的组件,其他组件缓存

- 利用路由的元属性meta，配合v-if动态判断



两个钩子函数：

- activated()：进入这个缓存组件时触发

- deactivated()：离开这个缓存组件时触发

## 说一下对MVVM的理解？

M是model，指的是数据层，即data，V是view，指的是视图层，即template，VM是viewModel，指的是视图模型，即vue实例，是连接view和model的桥梁。数据和视图不能直接通信，必须经过VM实现通信。

## 说一下vue2的响应式原理？

vue2采用`数据代理+数据劫持+发布订阅`模式的方法。

在初始化vue实例时，会把data对象和data对象的属性都添加到`vm对象`中，通过`object.defineProperty()`进行数据代理，用vm对象的属性来`代理data`对象的属性，

并在`Observer`类中`递归遍历data`对象，对data对象中的每个属性都进行`数据劫持`，都指定一个`getter、setter`。

例外的，对于数组，不能通过object.defineProperty()进行数据代理，因为监听的数组下标变化时会出现数据错乱问题，所以数组是调用`数组重写的原生方法`来实现响应式。



当通过vm对象修改data对象中的属性时，会触发data属性的`setter`方法，然后触发它`Dep实例的notify`方法进行依赖分发，通知所有依赖的`Watcher`实例执行内部回调函数。

最后会触发`renderWatcher`回调，会重新执行`render函数`，重新`对比新旧虚拟DOM`，`重新渲染`页面。

【Watcher回调是异步任务，它的执行会遵循事件循环机制，且重复的Watcher回调不会放到任务队列中，所以多次重复数据更新时，只会重新渲染一次页面】。

当通过vm对象读取data对象中的属性时，会触发data属性的getter方法，然后触发它Dep实例的depend方法进行依赖收集。



当data对象中数组元素发生变化时，会调用数组重写的原生方法，然后触发它Dep实例的notify方法进行依赖分发，通知所有依赖的Watcher实例执行内部回调函数。

最后会触发renderWatcher回调，会重新执行render函数，重新对比新旧虚拟DOM，重新渲染页面。

当读取data对象中数组元素时，会触发数组的getter方法，然后触发它Dep实例的depend方法进行依赖收集。

## 说一下v-model数据双向绑定原理？

是一个语法糖，做了两件事

- v-bind绑定value，更新数据层

- v-on给元素绑定input事件，监听输入框中的内容，当发生改变时来执行一些事情，并更新视图层

## 说一下$set的作用和原理

1. 对象：
    - 响应式原理：通过触发setter实现更新
    - 对象中后追加的属性、删除已有属性，Vue默认不做响应式处理
    - 解决：this.$set()
2. 数组：
    - 响应式原理：调用重写的原生方法实现更新
    - 数组中修改某下标的元素、更新length，Vue默认不做响应式处理
    - 解决：this.$set()、使用原生API：push、pop、shift、unshift、splice、sort、reverse

### 原理

如果目标是数组，直接使用数组的splice方法通知实现更新

如果目标是对象，先给对象属性用数据代理添加getter、setter，再通过触发setter通知实现更新

## 说一下nextTick的使用场景和原理？

等待DOM更新后，再执行内部传入的回调函数

1. 使用场景：
    - created中想要获取DOM
    - 响应式数据变化后获取DOM更新后的状态，如 获取列表更新后的高度
2. 原理
    把nextTick回调方法放在renderWatcher回调之后执行，这样就能拿到更新后的DOM

## 说一下对单向数据流的理解

- 概念：父级给子组件是啥，子组件可以用，也可以不用，但是不能修改【单向数据流针对于组件通信】
- 作用：保证了数据的可控性，方便预测和调试
- 注意：Vue中的单向数据流是针对基本数据类型，而引用类型是对数据地址的引入，子组件修改数据，父组件能接收到数据的更改
- 应用：父子传参：子组件不能直接修改父组件的数据，要么通过props从父组件传递过来，要么通过emit在父组件中修改

## vue异步组件怎么加载的

Vue中的异步组件可以通过两种方式进行加载：使用`工厂函数`或使用`import函数`。

1. 使用`工厂函数`： 在`Vue 2`中，可以使用`工厂函数来定义异步组件`。工厂函数返回一个Promise对象，该Promise对象在解析时会动态地加载组件。

```js
Vue.component('AsyncComponent', function (resolve, reject) {
     setTimeout(function () {
       resolve({
         template: '<div>This is an async component.</div>'
       });
     }, 2000);
   });

```

在上述示例中，定义了一个名为 AsyncComponent 的异步组件。在工厂函数内部，通过setTimeout模拟一个异步操作，2秒后通过resolve返回组件的定义。

2. 使用`import函数`： 在`Vue 2.4及以上版本和Vue 3`中，可以使用import函数来定义异步组件。import函数返回一个Promise对象，在解析时会动态地加载组件。

```js
Vue.component('AsyncComponent', () => import('./AsyncComponent.vue'));
```

在上述示例中，通过import函数异步地加载名为 AsyncComponent 的组件。在import函数中指定组件的路径，Vue会自动处理异步加载并渲染组件。 无论是使用工厂函数还是import函数，Vue都会在需要时自动地异步加载组件，从而提高应用的性能和加载速度。异步组件在需要时才会被加载和渲染，可以减少初始加载时的资源负担，提高用户体验。

## vue中权限是怎么设置的？

在Vue中设置权限可以通过以下几种方式： 
1. `路由权限控制`：在Vue Router中可以通过路由元信息（meta）来定义路由的权限要求。您可以在路由配置中为每个路由添加一个`meta`字段，并将权限信息存储在其中。然后，在全局前置守卫（`beforeEach`）中，可以根据用户的权限来判断是否允许访问该路由。

```js
// 路由配置
   const routes = [
     {
       path: '/admin',
       name: 'Admin',
       component: Admin,
       meta: { requiresAuth: true } // 需要登录权限
     },
     // ...
   ];
   
   // 全局前置守卫
   router.beforeEach((to, from, next) => {
     if (to.meta.requiresAuth && !isAuthenticated()) {
       next('/login'); // 没有权限，跳转到登录页面
     } else {
       next(); // 有权限，继续导航
     }
   });
```
2. `组件级权限控制`：在组件中可以根据用户的权限来决定是否显示或执行特定的操作。您可以在组件中使用条件语句或计算属性来判断用户的权限，并根据权限来渲染不同的内容或执行不同的逻辑。

```js
<template>
     <div>
       <button v-if="hasPermission('create')">Create</button>
       <button v-if="hasPermission('edit')">Edit</button>
       <button v-if="hasPermission('delete')">Delete</button>
     </div>
   </template>
   
   <script>
   export default {
     methods: {
       hasPermission(permission) {
         // 根据用户权限判断是否有权限
         return this.userPermissions.includes(permission);
       }
     }
   };
   </script>
```
3. `API权限控制`: 在与后端交互的过程中，可以根据后端返回的用户权限信息来控制前端的行为。例如，在获取数据或提交数据时，可以根据用户的权限来决定是否允许进行相应的操作。 这些方法可以根据您的具体需求和项目结构来选择使用。根据您的权限设置，您可以在路由层面、组件层面或者与后端交互的层面来进行权限控制

## vue首页加载慢怎么解决

Vue.js 是一个用于构建用户界面的 JavaScript 框架，它本身并不会直接导致首页加载缓慢。首页加载缓慢可能有多种原因，以下是一些常见的解决方法：

- `路由懒加载`

```js
{
    path: '/chinaWine',
    name: 'chinaWine',
    component: resolve => require(['./views/chinaWine'], resolve)
},
```
此方法会把`原本打包到一个app.js文件分开成多个js文件`打包，这样会减小单个文件的大小，但是不会减小整个js文件夹的大小。
通过这种方式可以做到按需加载，只加载单个页面的js文件。

- 打包文件中去掉map文件

打包的app.js过大，另外还有一些生成的map文件。先将多余的map文件去掉，

找到config文件夹下index.js文件,把这个build里面的productionSourceMap改成false即可
- CDN引入第三方库
    在项目开发中，我们会用到很多第三方库，如果可以按需引入，我们可以只引入自己需要的组件，来减少所占空间，
但也会有一些不能按需引入，我们可以采用CDN外部加载，在index.html中从CDN引入组件，去掉其他页面的组件import，修改webpack.base.config.js，在externals中加入该组件，这是为了避免编译时找不到组件报错。
- `gzip打包`
    gizp压缩是一种http请求优化方式，通过减少文件体积来提高加载速度。html、js、css文件甚至json数据都可以用它压缩，可以减小60%以上的体积。
    - `npm i -D compression-webpack-plugin`
    - 在vue.config.js中配置
    ```js
    const CompressionPlugin = require('compression-webpack-plugin')

    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            return {
                plugins: [new CompressionPlugin({
                    test: /\.js$|\.html$|\.css/,
                    threshold: 10240,
                    deleteOriginalAssets: false
                })]
            }
        }
    }

    ```
    - 在NGINX中配置(nginx -s reload ：修改配置后重新加载生效)
    ```js
            http {
            gzip  on;
            gzip_min_length    1k;
            gzip_buffers        4 8k;
            gzip_http_version  1.0;
            gzip_comp_level    8;
            gzip_proxied        any;
            gzip_types          application/javascript text/css image/gif;
            gzip_vary          on;
            gzip_disable        "MSIE [1-6]\.";
            #以下的配置省略...
        }
    ```
- 终极大招，预渲染
    - `cnpm install prerender-spa-plugin --save-dev`
    - vue.config.js
    ```js
    const path = require('path');
    const PrerenderSPAPlugin = require('prerender-spa-plugin');
    const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

    在plugins下面，找到plugins对象，直接加到上面就行
    // 预渲染配置
    new PrerenderSPAPlugin({
        //要求-给的WebPack-输出应用程序的路径预渲染。
        staticDir: path.join(__dirname, 'dist'),
        //必需，要渲染的路线。
        routes: ['/login'],
        //必须，要使用的实际渲染器，没有则不能预编译
        renderer: new Renderer({
            inject: {
                foo: 'bar'
            },
            headless: false, //渲染时显示浏览器窗口。对调试很有用。  
            //等待渲染，直到检测到指定元素。
            //例如，在项目入口使用`document.dispatchEvent(new Event('custom-render-trigger'))` 
            renderAfterDocumentEvent: 'render-event'
        })
    })

    ```
    - router.js: 需要把vue的router模式设置成history模式
    - 在创建vue实例的mounted里面加一个事件，跟PrerenderSPAPlugin实例里面的renderAfterDocumentEvent对应上。
    ```js
    mounted () {
        document.dispatchEvent(new Event('render-event'))
    },
    ```
- 优化代码：确保你的代码是高效的，避免不必要的计算和操作，尽量减少网络请求和资源加载。
- `懒加载`：使用懒加载技术，将页面上的一些资源延迟加载，只在需要时再加载，可以提高初始加载速度。
- `代码分割`：将代码分割成多个小块，按需加载，这样可以减少初始加载的文件大小，加快页面加载速度。
- `图片优化`：对于图片资源，可以使用合适的压缩算法和格式，减小图片文件的大小，提高加载速度。
- `CDN 加速`：使用内容分发网络（CDN）来加速静态资源的加载，将资源分发到全球各地的服务器，减少网络延迟。
- `缓存策略`：合理设置缓存策略，利用浏览器缓存和服务器缓存，减少重复加载资源的次数。
- `服务器性能优化`：确保服务器的性能良好，可以考虑使用缓存、压缩、并发处理等技术来提高服务器的响应速度。

# vuex

## 说一下对vuex的理解？

五种状态：

- state: 存储公共数据 this.$store.state
- mutations：同步操作，改变store的数据 this.$store.commit()
- actions: 异步操作，让mutations中的方法能在异步操作中起作用 this.$store.dispatch()
- getters: 计算属性 this.$store.getters
- modules: 子模块

使用场景：

用户信息、菜单信息、购物车信息

解决vuex页面刷新数据丢失问题的方式：

- 将vuex中的数据直接保存到浏览器缓存中（sessionStorage、localStorage、cookie）
- 在页面刷新的时候再次请求远程数据，使之动态更新vuex数据


