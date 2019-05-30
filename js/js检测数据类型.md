### typeof

 只能检测出`undefined`，` string`， `number`， `boolean `， `symbol`， `function`，`object`

#### 返回值

- 基本类型，除 null 以外，均可以返回正确的结果。
- 引用类型，除 function 以外，一律返回 object 类型。
-  null ，返回 object 类型。
- function 返回  function 类型。

#### 原理

js 在底层存储变量的时候，会在变量的机器码的低位1-3位存储其类型信息

- 000：对象
- 010：浮点数
- 100：字符串
- 110：布尔
- 1：整数

`null`：所有机器码均为0

`undefined`：用 −2<sup>30</sup> 整数来表示

`typeof` 在判断 `null` 的时候由于 `null` 的所有机器码均为0，因此直接被当做了对象来看待。

### toString

```js
const isType = type => target =>
  Object.prototype.toString.call(target) === `[object ${type}]`;

const isArray = isType("Array");
const isRegExp = isType("RegExp");
const isNull = isType("Null");
```

### instanceof

instanceof运算符用于测试构造函数的prototype属性是否出现在对象的原型链中的任何位置

```js
function _instanceof(left, right) {
  while (Object.getPrototypeOf(left) && right.prototype) {
    if (Object.getPrototypeOf(left) === right.prototype) {
      return true;
    }
    left = Object.getPrototypeOf(left);
  }
  return false;
}
```

实现的`_instanceof`和直接使用instanceof对基本类型判断表现不一致

```js
[1] instanceof Array 		// true
[1] instanceof Object 	// true
'tom' instanceof String //false
11 instanceof Number 		//false
```

`instanceof`运算符直接访问的变量的原始值，不会自动建立包装类。因此不能用来判断基本类型值。

**instanceof 只能用来判断两个对象是否属于实例关系， 而不能判断一个对象实例具体属于哪种类型。**

#### 问题

`instanceof`假定只有一个全局执行环境。如果网页中包含多个框架，那实际上就存在两个以上不同的全局执行环境，从而存在两个以上不同版本的构造函数。如果你从一个框架向另一个框架传入一个数组，那么传入的数组与在第二个框架中原生创建的数组分别具有各自不同的构造函数。

### constructor

```js
's'.constructor === String // true
```

#### todo

- null和undefined没有constructor属性，可以采用其他判断方式
-  函数的 constructor 是不稳定的，这个主要体现在自定义对象上，当开发者重写 prototype 后，原有的 constructor 引用会丢失，constructor 会默认为 Object