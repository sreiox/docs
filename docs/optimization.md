---
outline: deep
---

### 请求前

#### 浏览器本地缓存

可能会问到那篡改问题怎么办？前后端都需要校验数据

#### 减少不必要的请求

- 减少404
- 重定向
- 合并文件数量

#### 静态资源cdn加速

图片不缩放、精灵图、七牛云上传、懒加载、base64格式、cdn静态资源分离（vue打包）

#### 压缩资源

build压缩优化、splitchunks

#### 防抖/节流

#### 渲染优化

样式表位置、js文件defer

减少http请求，eg：秒杀的高频刷新、点击按钮

### 前后端合作

#### 浏览器强缓存

对于静态资源设置expires和cache-control

#### 浏览器弱缓存

对于动态资源

#### http请求能用get就不用post

### 后端

- 做缓存（radis、mangodb内存读取）
- 限流（限制api请求数量）
- 支持内容gzip压缩（accept-ecoding、content-ecoding）
- 额度收费

### 服务端

网络分流、负载均衡

