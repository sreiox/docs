# TypeScript

## 1. type和interface的区别

`interface`可以`重复声明`，type不行，`继承方式`不一样，type使用`交叉类型`方式，interface使用`extends`实现。在对象扩展的情况下，使用接口继承要比交叉类型的性能更好。建议使用interface来描述对象对外暴露的借口，使用type将一组类型重命名（或对类型进行复杂编程）。

```js
interface iMan {
  name: string;
  age: number;
}
// 接口可以进行声明合并
interface iMan {
  hobby: string;
}

type tMan = {
  name: string;
  age: number;
};
// type不能重复定义
// type tMan = {}

// 继承方式不同,接口继承使用extends
interface iManPlus extends iMan {
  height: string;
}
// type继承使用&，又称交叉类型
type tManPlus = { height: string } & tMan;

const aMan: iManPlus = {
  name: "aa",
  age: 15,
  height: "175cm",
  hobby: "eat",
};

const bMan: tManPlus = {
  name: "bb",
  age: 15,
  height: "150cm",
};
```
## 2. any、unkonwn、never

`any`和`unkonwn`在TS类型中属于最顶层的`Top Type`，即所有的类型都是它俩的`子类型`。而`never`则相反，它作为`Bottom Type`是所有类型的子类型。

## 3. 常见的工具类型

- `Partial`：满足部分属性(一个都没满足也可)即可
- `Required`：所有属性都需要
- `Readonly`: 包装后的所有属性只读

![tupian](./assets/img/13.webp)

- `Pick`: 选取部分属性
- `Omit`: 去除部分属性

![tupian](./assets/img/14.webp)

- `Extract`: 交集
- `Exclude`: 差集

![tupian](./assets/img/15.webp)

