#### 变量

#### var

定义变量

####  默认值

没有初始化的变量自动获取一个默认值为null

#### 可选的类型

可以在声明变量的时候加上具体类型

`String name = ''`

#### Final/const

以后不打算修改一个变量

##### final

- 只能赋值一次
- 顶级的final变量或者类中的final变量在第一次使用的时候初始化

##### const

- 编译时常量，（const变量同样也是final变量）
- 变量在类中，使用static const
- 也可以用来创建不变的值，还能定义构造函数为const类型的，这种类型的构造函数创建的对象是不可改变的。任何变量都可以有一个不变的值。

**todo**

 实例变量可以为final但是不能为const

#### 内置类型

- numbers
- strings
- booleans
- lists(arrays)
- maps
- runes (用于在字符串中表示 Unicode 字符)
- symbols

**todo**

由于 Dart 中每个变量引用的都是一个对象 – 一个类的实例， 你通常使用构造函数来初始化变量。 一些内置的类型具有自己的构造函数。例如， 可以使用 `Map()`构造函数来创建一个 map， 就像这样 `new Map()`。

#### Numbers

支持两种类型的数字

**int**

整数值， -2 ** 53 ～ 2 ** 53

**double**

64-bit (双精度) 浮点数，符合 IEEE 754 标准。

> `int` 和 `double` 都是 [`num`](https://api.dartlang.org/stable/dart-core/num-class.html) 的子类。 num 类型定义了基本的操作符，例如 +, -, /, 和 *， 还定义了 `abs()`、` ceil()`、和 `floor()` 等 函数。

#### Strings

Dart 字符串是 UTF-16 编码的字符序列。 可以使用单引号或者双引号来创建字符串

可以在字符串中使用表达式，用法是这样的： `${`*expression*`}`。如果表达式是一个变量，可以省略 {}。 如果表达式的结果为一个对象，则 Dart 会调用对象的 `toString()` 函数来获取一个字符串。

```dart
var s = 'string interpolation';

assert('Dart has $s, which is very handy.' ==
       'Dart has string interpolation, ' +
       'which is very handy.');
assert('That deserves all caps. ' +
       '${s.toUpperCase()} is very handy!' ==
       'That deserves all caps. ' +
       'STRING INTERPOLATION is very handy!');
```

**todo**

 `==` 操作符判断两个对象的内容是否一样。 如果两个字符串包含一样的字符编码序列， 则他们是相等的。

```dart
//可以使用 `+` 操作符来把多个字符串链接为一个，也可以把多个 字符串放到一起来实现同样的功能：
var s1 = 'String ' 'concatenation'
         " works even over line breaks.";
assert(s1 == 'String concatenation works even over '
             'line breaks.');

var s2 = 'The + operator '
         + 'works, as well.';
assert(s2 == 'The + operator works, as well.');
```

```dart
//使用三个单引号或者双引号也可以 创建多行字符串对象：
var s1 = '''
You can create
multi-line strings like this one.
''';

var s2 = """This is also a
multi-line string.""";
```

```dart
//通过提供一个 `r` 前缀可以创建一个 “原始 raw” 字符串：
var s = r"In a raw string, even \n isn't special.";
```

#### Booleans

为了代表布尔值，Dart 有一个名字为 `bool` 的类型。 只有两个对象是布尔类型的：`true`和 `false` 所创建的对象， 这两个对象也都是编译时常量。

当 Dart 需要一个布尔值的时候，只有 `true` 对象才被认为是 true。 所有其他的值都是 flase。这点和 JavaScript 不一样， 像 `1`、 `"aString"`、 以及 `someObject` 等值都被认为是 false。

#### lists(列表)

[文档](https://api.dartlang.org/stable/2.2.0/dart-core/List-class.html)

数组

```dart
// 定义一个不变的list对象
var constantList = const [1, 2, 3];
```

##### 泛型

类型定义为 `List<E>`。 这个 <…> 声明 list 是一个 *泛型* (或者 *参数化*) 类型。通常情况下，使用一个字母来代表类型参数， 例如 E, T, S, K, 和 V 等。

```dart
// 只包含某一类类型的对象
//只包含字符串
var names = new List<String>();
names.addAll(['Seth', 'Kathy', 'Lars']);
//减少重复的代码
//T 是一个备用类型。这是一个类型占位符， 在开发者调用该接口的时候会指定具体类型。
abstract class Cache<T> {
  T getByKey(String key);
  setByKey(String key, T value);
}
```

###### 使用集合字面量

List 和 map 字面量也是可以参数化的。 参数化定义 list 需要在中括号之前 添加 `<*type*>` ， 定义 map 需要在大括号之前 添加 `<*keyType*, *valueType*>`。 如果你需要更加安全的类型检查，则可以使用 参数化定义。

```dart
var names = <String>['Seth', 'Kathy', 'Lars'];
var pages = <String, String>{
  'index.html': 'Homepage',
  'robots.txt': 'Hints for web robots',
  'humans.txt': 'We are people, not machines'
};
```

###### 在构造函数中使用泛型

在调用构造函数的时候， 在类名字后面使用尖括号(`<...>`)来指定 泛型类型。例如：

```dart
var names = new List<String>();
names.addAll(['Seth', 'Kathy', 'Lars']);
var nameSet = new Set<String>.from(names);
```

下面代码创建了一个 key 为 integer， value 为 View 类型 的 map：

```dart
var views = new Map<int, View>();
```

###### 泛型集合及其包含的类型

Dart 的泛型类型是固化的，在运行时有也 可以判断具体的类型。例如在运行时（甚至是成产模式） 也可以检测集合里面的对象类型：

```dart
var names = new List<String>();
names.addAll(['Seth', 'Kathy', 'Lars']);
print(names is List<String>); // true
```

注意 `is` 表达式只是判断集合的类型，而不是集合里面具体对象的类型。 在成产模式，`List<String>` 变量可以包含 非字符串类型对象。对于这种情况， 你可以选择分别判断每个对象的类型或者 处理类型转换异常

###### 限制泛型类型

当使用泛型类型的时候，你 可能想限制泛型的具体类型。 使用 `extends` 可以实现这个功能

###### 使用泛型函数

一开始，泛型只能在 Dart 类中使用。 新的语法也支持在函数和方法上使用泛型了。

```dart
T first<T>(List<T> ts) {
  // ...Do some initial work or error checking, then...
  T tmp ?= ts[0];
  // ...Do some additional checking or processing...
  return tmp;
}
```

这里的 `first` (`<T>`) 泛型可以在如下地方使用 参数 `T` ：

- 函数的返回值类型 (`T`).
- 参数的类型 (`List<T>`).
- 局部变量的类型 (`T tmp`).