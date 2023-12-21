# Html5和CSS3

## 1. 常见的水平垂直居中实现方案

- 最简单的方案当然是flex布局
```css
.father {
    display: flex;
    justify-content: center;
    align-items: center;
}
.son {
   ...
}
```
- 绝对定位配合margin:auto,的实现方案
```css
.father {
    position: relative;
}
.son {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
}
```
- absolute+负margin
```css
.father {
	position: relative;
	width: 300px;
	height: 300px;
	border: 3px solid red;
  }
  .son {
	position: absolute;
	width: 100px;
	height: 100px;
	background-color: aqua;
	top: 50%;
	left: 50%;
	/* 负margin须是高度或宽度的一半 */
	margin-top: -50px;
	margin-left: -50px;
  }
```
- absolute+calc(css3计算属性)
- absolute+transform
- 绝对定位配合transform实现
```css
.father {
    position: relative;
}
.son {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```
- Grid 方案
```css
.outer {
  display: grid;
}

.inner {
  justify-self: center; /* 水平居中 */
  align-self: center; /* 垂直居中 */
}
```
- 父元素display:table-cell;vertical-align:center。里面的子元素就会实现水平垂直居中，不需要知道子元素的宽高
```css
/* HTML */
<div class='father'>
  <div class='son'></div>
</div>
<style>
  .father {
	display: table-cell;
	vertical-align: middle;
	text-align: center;
	width: 300px;
	height: 300px;
	border: 3px solid red;
  }
  .son {
	width: 100px;
	height: 100px;
	background-color: aqua;
	display: inline-block;
  }
</style>
```
- line-height
父元素：line-height=height，text-align:center。子元素：display:inline-block,vertical-align: middle。子元素水平垂直居中，`不需要知道子元素的宽高`
```css
<!-- HTMl -->
<div class="father">
	<div class="son"></div>
</div>
<style>
  .father {
	width: 300px;
	height: 300px;
	border: 3px solid red;
	line-height: 300px;
	text-align: center;
  }
  .son {
	background-color: aqua;
	width: 100px;
	height: 100px;
	display: inline-block;
	vertical-align: middle;
  }
</style>
```
- writing-mode
```css
<div class="grandfather">
  <div class="father">
	<div class="son"></div>
  </div>
</div>
<style>
  .grandfather {
	width: 300px;
	height: 300px;
	border: 3px solid red;
	writing-mode: vertical-lr;
	text-align: center;
  }
  .father {
	writing-mode: horizontal-tb;
	display: inline-block;
	width: 100%;
  }
  .son {
	background-color: blue;
	width: 100px;
	height: 100px;
	display: inline-block;
  }
</style>
```
## 2. BFC问题

> `BFC（Block Formatting Context）`，即块级格式化上下文，BFC目的是形成一个相对于外界完全独立的空间，让内部的子元素不会影响到外部的元素。

BFC形成条件:
- 根元素，即`HTML`元素
- 浮动元素：`float`值为`left`、`right`
- `overflow`值不为 `visible`，为 `auto`、`scroll`、`hidden`
- `display`的值为`inline-block`、`inltable-cell`、`table-caption`、`table`、`inline-table`、`flex`、`inline-flex`、`grid`、`inline-grid`
- `position`的值为`absolute`或`fixed`

BFC渲染规则：
- 内部的盒子会在垂直方向上一个接一个的放置
- 对于同一个BFC的俩个相邻的盒子的margin会发生重叠，与方向无关。
- 每个元素的左外边距与包含块的左边界相接触（从左到右），即使浮动元素也是如此
- BFC的区域不会与float的元素区域重叠
- 计算BFC的高度时，浮动子元素也参与计算
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然

### 应用场景

- 防止margin重叠（塌陷）
    对于同一个BFC的两个相邻的盒子margin会发生重叠，大小是最大的margin 以下这段代码中的两个p元素同属于一个BFC，之间的margin是100px

    ![这是图片](./assets/img/3.webp "Magic Gardens")

    防止margin重叠，就要将其置于两个BFC中，可以这样解决：

    ![这是图片](./assets/img/4.webp "Magic Gardens")

- 清除内部浮动

    ![浮动](./assets/img/5.webp)

    效果图如下（可以看到因为浮动，.box的高度不包含.fl的高度，高度为0）：

    ![浮动](./assets/img/6.webp)

    我们可以将.box触发为BFC,计算高度时，浮动元素也会参与计算, 给.box添加overflow:hidden属性：

    ![浮动](./assets/img/7.webp)

    最后效果如下：

    ![浮动](./assets/img/8.webp)

- 自适应多栏布局 这里举个两栏的布局

    ![浮动](./assets/img/9.webp)

    前面讲到，每个元素的左外边距与包含块的左边界相接触。因此，虽然.aslide为浮动元素，但是main的左边依然会与包含块的左边相接触

    而BFC的区域不会与浮动盒子重叠

    所以我们可以通过触发main生成BFC，以此适应两栏布局

    ![浮动](./assets/img/10.webp)

    效果如下：

    ![浮动](./assets/img/11.webp)

## 3. flex:1; 是哪些属性的缩写，对应的属性代表什么含义

`flex: 1`;在浏览器中查看分别是`flex-grow`（设置了对应元素的增长系数）、`flex-shrink`(指定了对应元素的收缩规则，只有在所有元素的默认宽度之和大于容器宽度时才会触发)、`flex-basis`（指定了对应元素在主轴上的大小）

![浮动](./assets/img/12.webp)


# 性能优化题

## 什么情况下会重绘和回流，常见的改善方案

浏览器请求到对应页面资源的时候，会将`HTML解析成DOM`，把`CSS解析成CSSDOM`，然后将DOM和CSSDOM合并就产生了`Render Tree`。在有了渲染树之后，浏览器会根据流式布局模型来计算它们在页面上的`大小和位置`，最后将`节点绘制`在页面上。

那么当`Render Tree`中部分或全部元素的`尺寸、结构、或某些属性`发生改变，浏览器就会`重新渲染页面`，这个就是浏览器的`回流`。常见的回流操作有：`页面的首次渲染`、`浏览器窗口尺寸改变`、`部分元素尺寸或位置变化`、`添加或删除可见的DOM`、`激活伪类`、`查询某些属性或调用方法`（各种`宽高的获取`，`滚动方法的执行`等）。

当页面中的`元素样式的改变不影响它在文档流的位置`时（如`color`、`background-color`等），浏览器对应元素的样式，这个就是`重绘`。

可见：`回流必将导致重绘，重绘不一定会引起回流。回流比重绘的代价更高`。

常见改善方案：

- 在进行频繁操作的时候，使用防抖和节流来控制调用频率。
- 避免频繁操作`DOM`，可以利用`DocumentFragment`，来进行对应的DOM操作，将最后的结果添加到文档中。
- 灵活使用`display: none`属性，操作结束后将其显示出来，因为`display`的属性为`none`的元素上进行的DOM操作不会引发`回流和重绘`。
- 获取各种会引起`重绘/回流`的属性，尽量将其`缓存`起来，不要频繁的去获取。
- 对`复杂动画采用绝对定位`，使其脱离文档流，否则它会频繁的引起父元素及其后续元素的回流。

## 一次请求大量数据怎么优化，数据多导致渲染慢怎么优化

个人觉得这就是个伪命题，首先后端就不该一次把大量数据返回前端，但是会这么问，那么我们作为面试的就老老实实回答呗。

首先大量数据的接收，那么肯定是用`异步的方式进行接收`，对数据进行一个`分片处理`，可以拆分成一个个的小单元数据，通过自定义的属性进行关联。这样数据分片完成。接下来渲染的话，由于是大量数据，如果是长列表的话，这里就可以使用`虚拟列表`（当前页面需要渲染的数据拿到进行渲染，然后对前面一段范围及后面一段范围，监听对应的`滚动数据来切换需要渲染的数据`，这样始终要渲染的就是三部分）。当然还有别的渲染情况，比如echarts图标大量点位数据优化等。



