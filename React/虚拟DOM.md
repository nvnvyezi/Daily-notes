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
//用于组件更新状态的基类助手。
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // 如果组件具有字符串refs，我们稍后将分配一个不同的对象。
  this.refs = emptyObject;
  // 我们初始化了默认的更新器，但是真正的更新器是由渲染器注入的。
  this.updater = updater || ReactNoopUpdateQueue;
}
```

在Component的原型上有

```js
Component.prototype.isReactComponent = {};
//改变state时使用setstate，并且setstate不保证同步，即state有可能不会立即更新，如果你要使用改变后的值，可以提供一个回调，
Component.prototype.setState = function (partialState, callback) {
  //setState(…):获取要更新的状态变量对象或返回状态变量对象的函数。
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
//部署一个更新。只有当明确知道我们不在DOM事务中时，才应该调用它。当您知道组件状态的某些更深层的方面发生了更改，但是没有调用setState时，您可能想要调用它。这不会调用shouldComponentUpdate，但它会调用componentWillUpdate和componentDidUpdate。
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

`PureComponent`

```js
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

// 方便组件默认浅检查并平等。当当前组件的状态不受影响，则不会更新
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent;
// 避免对这些方法进行额外的原型跳转。
_assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;
```

从上面我们发现setstate这些方法都是继承自`Component`，并且`PureComponent`的构造函数和`Component`是一模一样的，在原型上面共享了`Component`的，并且加了判断是哪种类型

在创建组件的时候会发现实际调用的是`createElement`，但是在react源码中还做了一层

```js
// 创建带有验证的元素
function createElementWithValidation(type, props, children) {
  // 检测type是否是有效的元素类型
  var validType = isValidElementType(type);
  // 在这种情况下我们警告，但不要投掷。我们希望元素创建成功，渲染中可能会出现错误。即判断组件是否有效
  if (!validType) {
    var info = '';
    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      // 您可能忘记从文件' + '中导出组件，或者您可能混淆了默认导入和命名导入
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }
		// 获取源信息错误附录,获取错误的地方，例子Check your code at index.js:873."
    var sourceInfo = getSourceInfoErrorAddendum(props);
    if (sourceInfo) {
      info += sourceInfo;
    } else {
      // 获取声明错误添加
      info += getDeclarationErrorAddendum();
    }

    var typeString = void 0;
    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
      // 您是否意外地导出了JSX文字而不是组件
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
  }

  var element = createElement.apply(this, arguments);

  // 如果使用了mock或自定义函数，则结果可能为空。TODO:当不再允许这些参数作为类型参数时删除它。
  if (element == null) {
    return element;
  }

  // 如果类型无效，则跳过键警告，因为我们的键验证逻辑不期望非字符串/函数类型，并可能抛出令人困惑的错误。我们不希望在dev和prod之间出现异常行为(呈现会抛出有用的消息，一旦类型被修复，就会出现关键警告)。
  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}
```

接下来看`ReactElement`

```js
//创建并返回一个新的ReactElement给定的类型。
//参数分别是组件的类型，配置比如refs，class等，和组件的children
function createElement(type, config, children) {
  var propName = void 0;
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
    //判断config上面是否有key，并且key是有效的
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 剩余的属性被添加到一个新的道具对象中
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // 子参数可以是多个参数，这些参数被转移到新分配的props对象上。
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

  // 分解defaultprops
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
        // 定义key为只读，不能像其他的props一样可以传递给子组件,如果需要传递，则应该在设置另外一个值进行传递
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        //定义ref为只读，不能访问
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
```

在最后将处理的值给`ReactElement`，

```js
var ReactElement = function (type, key, ref, self, source, owner, props) {
  //创建组件一些基本的属性
  var element = {
    // 这个标记允许我们唯一地将其标识为React元素
    $$typeof: REACT_ELEMENT_TYPE,

    // 属于元素的内置属性
    type: type,
    key: key,
    ref: ref,
    props: props,

    // 记录负责创建此元素的组件。
    _owner: owner
  };

  {
    // 验证标志目前是可变的。我们把它放在一个外部备份存储上，这样我们就可以冻结整个对象。一旦在常用的开发环境中实现了这些功能，就可以用WeakMap替换它们。
    element._store = {};

    // 为了使比较反应物元素更容易用于测试目的，我们使验证标志不可枚举(如果可能的话，应该包括我们运行测试的每个环境)，因此测试框架忽略了它。
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    });
    // self和source仅是DEV属性。
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    });
    // 在两个不同的位置创建的两个元素在测试目的上应该被认为是相等的，因此我们对枚举隐藏它。
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
```

再来一张图，可以结合着看，`$$typeof`,`key`, `props`,	`ref`,  `_owner_`也就是上面我们的element，

- key 代表元素唯一标志值，即当更新后key值没变，则证明这个元素还可以继续用。
- type 代表元素种类,  有 function(空的wrapper)、class(自定义类)、string(具体的DOM元素名称)类型, 与key一样, 只要改变, 元素肯定不一样;
- props 是元素的属性, 任何写在标签上的属性(如`className='‘`,`ref=''`)都会被存在这里, 如果这个元素有子元素(包括文本内容), props就会有children属性, 存储子元素; children属性是递归插入、递归更新的依据;

![1542293755665](./1542293755665.png)



> react虚拟dom的话实际就是用js对象来描述dom结构，在我们创建一个class组件的时候，实际上创建的是一个`ReactcompositeComponent`组件，我们每次写的时候都会写extends `React.Component`，实际就是继承React的`component`或者`PureComponent`，在`Component`里面就有我们的props，refs，context等，而`PureComponent`和`Component`的构造函数是一样的，不一样的是他借助了一个辅助函数继承了`Component`的原型，并且使自己也成为了一个构造函数。进入创建组件，在实际创建组件的时候，实际上是使用了`createElement`，而从源码的角度看实际调用的就是`createElementWithValidation`，我们会发现，在调用这个函数的时候首先会先判断type是否有效，在有效的情况下继续执行，接着执行`createElement`，在这个函数里面，对传进去的`config`进行处理，并且对`children`进行合并以及冻结操作，在之后是对`config`中处理过的`key`和`ref`进行一个处理，比如判断key是否有效，以及设置key不可被当做props传给下面，随后将这这些属性传给`ReactElement`，在`Reactelement`中返回的就是一开始我们看见的那种对象，并亲切在使用React中，我们都知道props是不可变的，其实就是在`Reactelement`中使用了freeze，使对象无法修改，并且无法添加新的属性，也无法删除属性，并且无法修改属性的值。

