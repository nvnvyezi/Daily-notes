### Component

```react
class App extends React.Component{}
class App extends React.PureComponent{}
```

在用class创建组件的时候，一般都会继承`Component`,`PureComponent`上面的一些方法

在`ReactBaseClasses`下就是这两个方法的定义

```js
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

`setState`和`forceUpdate`都是调用update里面的方法

```js
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
Object.assign(pureComponentPrototype, Component.prototype);
// 通过这个变量区别下普通的 Component
pureComponentPrototype.isPureReactComponent = true
```

`PureComponent`继承了`Component`上原型上的方法，其他基本都保持一致

### Refs

创建Refs

- 字符串方式，`ref="ref"`
- callback，`ref={(ref) => this.ref = ref}`
- `createRef`,`this.ref = React.createRef();ref={this.ref}`

在`ReactCreateRef`文件中

```js
export function createRef(): RefObject {
  const refObject = {
    current: null,
  };
  if (__DEV__) {
    Object.seal(refObject);
  }
  return refObject;
}
```

ref 的值根据节点的类型而有所不同：

- 当`ref`属性用于HTML元素时，构造函数中使用`React.createRef()`创建的`ref`接收底层DOM元素作为其`current`属性。
- 当`ref`属性用于自定义class组件时，`ref`对象接收组件的挂载实例作为其`current`属性。
- **你不能在函数组件上使用ref属性**，因为他们没有实例。

**访问Refs**

当ref被传递给`render`中的元素时，对该节点的引用可以在ref的`current`属性中被访问。

如果想在函数中使用refs，可以使用`React.forwardRef`

```react
export default function forwardRef<Props, ElementType: React$ElementType>(
  render: (props: Props, ref: React$Ref<ElementType>) => React$Node,
) {
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  };
}
```

使用

```react
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

