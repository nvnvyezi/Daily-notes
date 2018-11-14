先来看虚拟dom是个什么东西

![](./1541687604748.png)

我们发现上面用对象的方式表现了我们的dom结构

下来看这个是怎么生成的

我们知道react将组件分成了4种

- ReactEmptyComponent
- ReactTextComponent
- ReactDOMComponent
- ReactCompositeComponent

而我们通过class创建的也就是最经常用的就是`ReactCompositeComponent`。在我们手动使用class的时候，实际上我们继承的是`Component`或者`PureComponent`，

我们先看`Component`

```js
//Base class helpers for the updating state of a component.
//用于组件更新状态的基类助手。
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  // 如果组件具有字符串refs，我们稍后将分配一个不同的对象。
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  // 我们初始化了默认的更新器，但是真正的更新器是由渲染器注入的。
  this.updater = updater || ReactNoopUpdateQueue;
}
```

在Component的原型上有

```js
Component.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *上面的意思就是说设置state的状态应该使用setstate方法，并且这个方法不保证同步，
 
 * @param {object|function} partialState Next partial state or function to produce next partial state to be merged with current state.
 	下一个部分状态或函数，以生成下一个部分状态并与当前状态合并。
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
Component.prototype.setState = function (partialState, callback) {
  //setState(…):获取要更新的状态变量对象或返回状态变量对象的函数。
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *	部署一个更新。只有当明确知道我们不在DOM事务中时，才应该调用它。当您知道组件状态的某些更深层的方面发生了更改，但是没有调用setState时，您可能想要调用它。这不会调用' shouldComponentUpdate '，但它会调用' componentWillUpdate '和' componentDidUpdate '。
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

`PureComponent`

```js
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

/**
 * Convenience component with default shallow equality check for sCU.
 */
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.避免对这些方法进行额外的原型跳转。
_assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;
```

从上面我们发现setstate这些方法都是继承自`Component`，并且`PureComponent`的构造函数和`Component`是一模一样的，在原型上面共享了`Component`的，并且加了判断是哪种类型

在创建组件的时候会发现实际调用的是`createElement`，

```js
/**
 * Create and return a new ReactElement of the given type.
 		创建并返回一个新的ReactElement给定的类型。
 * See https://reactjs.org/docs/react-api.html#createelement
 */
//参数分别是组件的类型，配置比如refs，class等，和组件的children
function createElement(type, config, children) {
  var propName = void 0;

  // Reserved names are extracted
 	// 提取保留名称
  
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    //判断config上面是否有ref，并且ref是有效的
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  {
    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
```

