### JSX

一个 JavaScript 的语法扩展，可以生成React元素。

```jsx
// 使用JSX语法
function Test (){
	return <div>this is test</div>
}
// babel编译
function Test() {
  return React.createElement("div", null, "this is test");
}
```

所以JSX只是提供的在react中相对于`createElement	`更让人接受的一种语法

```js
/**
* 文件路径 react/ReactElement
* type 元素类型或者组件名称 例如div/Test
* config props属性
* children 当前元素下的内容
*/
function createElement(type, config, children) {}
```

首先验证 ref 和 key，在开发环境下，随后进行props赋值，类似className，使用forin，所以会进行检测是否是原型上的方法以及是否是RESERVED_PROPS即react要使用的几个props

```js
if (hasValidRef(config)) {
  ref = config.ref;
}
if (hasValidKey(config)) {
  key = '' + config.key;
}
for (propName in config) {
  if (
    hasOwnProperty.call(config, propName) &&
    !RESERVED_PROPS.hasOwnProperty(propName)
  ) {
    props[propName] = config[propName];
  }
}
```

之后根据children长度，将children分成数组或者就是它本身，并且在开发环境下对children进行冻结

```js
const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }
```

接着进行组件defaultProps的检测和赋值，以及key或者ref存在的情况下，对其进行监听（defineProperty），最后返回`React.ReactElement`

```js
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // 标识这是一个react元素
    $$typeof: REACT_ELEMENT_TYPE,
		// 元素内置属性
    type: type,
    key: key,
    ref: ref,
    props: props,
    // 记录负责创建此元素的组件
    _owner: owner,
  };
  return element;
}
```

借助ReactElement函数返回了我们常见的ReactElement对象，并且在开发环境下修改一些内置属性的描述符以及对对象和props进行冻结

#### 梳理

在`createElement`中先判断是否有config，有的话进行处理(key，ref),	接着进行children的处理，多个的话处理成数组，随后经过`ReactElement`方法返回ReactElement元素，主要属性有

| 参数       | 功能                                                         |
| ---------- | ------------------------------------------------------------ |
| `$$typeof` | [组件的标识信息](https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fpull%2F4832) |
| `type`     | 类型                                                         |
| `key`      | DOM结构标识，提升update性能                                  |
| `props`    | 子结构相关信息(有则增加`children`字段/没有为空)和组件属性(如`style`) |
| `ref`      | 真实DOM的引用                                                |
| `_owner`   | `_owner` === `ReactCurrentOwner.current`(ReactCurrentOwner.js),值为创建当前组件的对象，默认值为null。 |

