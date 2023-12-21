# vue-router

## 1. vue-router的路由守卫

- 全局前置守卫

```js
router.beforeEach((to, from, next) => {
    // to: 即将进入的目标
    // from:当前导航正要离开的路由
    return false // 返回false用于取消导航
    return {name: 'Login'} // 返回到对应name的页面
    next({name: 'Login'}) // 进入到对应的页面
    next() // 放行
})
```

- 全局解析守卫:类似beforeEach

```js
router.beforeResolve(to => {
    if(to.meta.canCopy) {
        return false // 也可取消导航
    }
})
```

- 全局后置钩子

```js
router.afterEach((to, from) => {
    logInfo(to.fullPath)
})
```

- 导航错误钩子，导航发生错误调用

```js
router.onError(error => {
    logError(error)
})
```

- 路由独享守卫,beforeEnter可以传入单个函数，也可传入多个函数。

```js
function dealParams(to) {
    // ...
}
function dealPermission(to) {
    // ...
}

const routes = [
    {
        path: '/home',
        component: Home,
        beforeEnter: (to, from) => {
            return false // 取消导航
        },
        // beforeEnter: [dealParams, dealPermission]
    }
]
```

### 组件内的守卫

```js
const Home = {
    template: `...`,
    beforeRouteEnter(to, from) {
        // 此时组件实例还未被创建，不能获取this
    },
    beforeRouteUpdate(to, from) {
        // 当前路由改变，但是组件被复用的时候调用，此时组件已挂载好
    },
    beforeRouteLeave(to, from) {
        // 导航离开渲染组件的对应路由时调用
    }
}
```

## 2. 说一下路由传参方式query和params的区别？

1. 传参方式
    - query通过path进行跳转传参，接收的时候通过this.$route.query进行接收
    - params通过name进行跳转传参，接收的时候通过this.$route.params进行接收
2. 安全性
    - params传值不会显示到地址栏，安全性高，但页面刷新数据会丢失
    - query传值会暴露在地址栏，页面刷新不会丢失

## 3. 说一下路由模式hash和history的区别？

在单页面应用SPA中，路由描述的是URL与视图之间的映射关系，这种映射是单向的，即URL变化引起视图更新（无需刷新页面）。

1. hash模式
    - 原理：用 `url + #`后面的hash值 来模拟一个完整的url，直接刷新页面不会导致浏览器向服务器发出新的请求，路由切换时不会当调用$router.push方法，会改变hash值触发hashchange事件，前进到指定的url。vue-router会根据url做路由匹配来修改页面内容，实现路由切换的效果改变hash值触发hashchange事件，`hashchange`事件对象中会记录变化的url。点击浏览器的前进后退，会`改变hash值，实现路由切换的效果`
    - 特点：地址栏有#，影响美观，直接刷新页面不会报404
2. history模式
    - 原理：用 `url + 路径` 真正实现一个完整的url，直接刷新页面会导致浏览器向服务器发出新的请求，路由切换时不会, 当调用$router.push方法，会改变路径调用pushState方法，前进到指定的url。vue-router会根据url做路由匹配来修改页面内容，实现路由切换的效果, 改变路径调用pushState方法，pushState方法中会记录变化的url。点击浏览器的前进后退 或者 手动调`back、forward、go`方法，会触发`popstate事件，实现路由切换的效果`
    - 特点: 地址栏没有#，不影响美观，直接刷新页面会报404，需要后端在Nginx中做代理地址的配置