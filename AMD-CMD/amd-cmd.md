[原文地址1](https://segmentfault.com/a/1190000004873947)

#### CommonJS

服务器端的规范。

1. 定义模块: 根据CommonJS规范，一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，也就是说，在该模块内部定义的变量，无法被其他模块读取，除非定义为global对象的属性

2. 模块输出: 模块只有一个出口，module.exports对象，我们需要把模块希望输出的内容放入该对象

3. 加载模块: 加载模块使用require方法，该方法读取一个文件并执行，返回文件内部的module.exports对象

```js
// foobar.js
 
//私有变量
var test = 123;
 
//公有方法
function foobar () {
    this.foo = function () {
        // do someing ...
    }
    this.bar = function () {
        //do someing ...
    }
}
 
//exports对象上的方法和变量是公有的
var foobar = new foobar();
exports.foobar = foobar;
//require方法默认读取js文件，所以可以省略js后缀
var test = require('./boobar').foobar;
 
test.bar();
```

commonjs一般加载是同步的，所以只有加载完成后才能执行后面的操作，node一般文件都在本地，所以比较快，不用考虑异步加载的方式，但是如果是浏览器环境，文件是从服务器加载的，就必须采用异步加载方式。也就是下面的AMD，CMD。

#### AMD

AMD是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义".

AMD设计出一个简洁的写模块API：
**define(id?, dependencies?, factory);**

- 第一个参数 id 为字符串类型，表示了模块标识，为可选参数。若不存在则模块标识应该默认定义为在加载器中被请求脚本的标识。如果存在，那么模块标识必须为顶层的或者一个绝对的标识。
- 第二个参数，dependencies ，是一个当前模块依赖的，已被模块定义的模块标识的数组字面量。
- 第三个参数，factory，是一个需要进行实例化的函数或者一个对象。

- 定义无依赖的模块

```js
define( {
    add : function( x, y ){
        return x + y ;
    }
} );
```

- 定义有依赖的模块

```js
define(["alpha"], function( alpha ){
    return {
        verb : function(){
            return alpha.verb() + 1 ;
        }
    }
});
```

- 定义数据对象模块

```js
define({
    users: [],
    members: []
});
```

- 具名模块

```js
define("alpha", [ "require", "exports", "beta" ], function( require, exports, beta ){
    export.verb = function(){
        return beta.verb();
        // or:
        return require("beta").verb();
    }
});
```

- 包装模块

```js
define(function(require, exports, module) {
    var a = require('a'),
          b = require('b');

    exports.action = function() {};
} );
```

不考虑多了一层函数外，格式和Node.js是一样的：使用require获取依赖模块，使用exports导出API。

除了define外，AMD还保留一个关键字require。require 作为规范保留的全局标识符，可以实现为 module loader，也可以不实现。

##### 模块加载

require([module], callback)

AMD模块化规范中使用全局或局部的require函数实现加载一个或多个模块，所有模块加载完成之后的回调函数。

其中：

[module]：是一个数组，里面的成员就是要加载的模块；
callback：是模块加载完成之后的回调函数。

例如：加载一个math模块，然后调用方法 math.add(2, 3);



```js
require(['math'], function(math) {
　math.add(2, 3);
});
```

### RequireJS

requireJS主要解决两个问题

1、多个js文件可能有依赖关系，被依赖的文件需要早于依赖它的文件加载到浏览器 
2、js加载的时候浏览器会停止页面渲染，加载文件越多，页面失去响应时间越长 

RequireJS 是一个前端的模块化管理的工具库，遵循AMD规范，它的作者就是AMD规范的创始人 James Burke。所以说RequireJS是对AMD规范的阐述一点也不为过。

RequireJS 的基本思想为：通过一个函数来将所有所需要的或者说所依赖的模块实现装载进来，然后返回一个新的函数（模块），我们所有的关于新模块的业务代码都在这个函数内部操作，其内部也可无限制的使用已经加载进来的以来的模块。

define用于定义模块，RequireJS要求每个模块均放在独立的文件之中。按照是否有依赖其他模块的情况分为独立模块和非独立模块。

- 独立模块，不依赖其他模块。直接定义：

```js
define({
    method1: function(){},
    method2: function(){}
});
```

也等价于

```js
define(function() {
    return {
        method1: function(){},
        method2: function(){}
    }
});
```

- 非独立模块，对其他模块有依赖。

```js
define([ 'module1', 'module2' ], function(m1, m2) {
    ...
});
```

或者：

```js
define(function(require) {
    var m1 = require('module1'),
          m2 = require('module2');
    ...
});
```

简单看了一下RequireJS的实现方式，其 require 实现只不过是提取 require 之后的模块名，将其放入依赖关系之中。

- require方法调用模块

在require进行调用模块时，其参数与define类似。

```js
require(['foo', 'bar'], function(foo, bar) {
    foo.func();
    bar.func();
} );
```

在加载 foo 与 bar 两个模块之后执行回调函数实现具体过程。

当然还可以如之前的例子中的，在define定义模块内部进行require调用模块

```js
define(function(require) {
    var m1 = require( 'module1' ),
          m2 = require( 'module2' );
    ...
});
```

define 和 require 这两个定义模块，调用模块的方法合称为AMD模式，定义模块清晰，不会污染全局变量，清楚的显示依赖关系。AMD模式可以用于浏览器环境并且允许非同步加载模块，也可以按需动态加载模块。

#### CMD

CMD是SeaJS 在推广过程中对模块定义的规范化产出

- 对于依赖的模块AMD是提前执行，CMD是延迟执行。不过RequireJS从2.0开始，也改成可以延迟执行（根据写法不同，处理方式不通过）。
- CMD推崇依赖就近，AMD推崇依赖前置。

```js
//AMD
define(['./a','./b'], function (a, b) {
 
    //依赖一开始就写好
    a.test();
    b.test();
});
 
//CMD
define(function (requie, exports, module) {
     
    //依赖可以就近书写
    var a = require('./a');
    a.test();
     
    ...
    //软依赖
    if (status) {
     
        var b = requie('./b');
        b.test();
    }
});
```

虽然 AMD也支持CMD写法，但依赖前置是官方文档的默认模块定义写法。

- AMD的API默认是一个当多个用，CMD严格的区分推崇职责单一。例如：AMD里require分全局的和局部的。CMD里面没有全局的 require，提供 seajs.use()来实现模块系统的加载启动。CMD里每个API都简单纯粹。

#### UMD

UMD是AMD和CommonJS的糅合

AMD模块以浏览器第一的原则发展，异步加载模块。
CommonJS模块以服务器第一原则发展，选择同步加载，它的模块无需包装(unwrapped modules)。
这迫使人们又想出另一个更通用的模式UMD （Universal Module Definition）。希望解决跨平台的解决方案。

UMD先判断是否支持Node.js的模块（exports）是否存在，存在则使用Node.js模块模式。
在判断是否支持AMD（define是否存在），存在则使用AMD方式加载模块。

```js
(function (root, factory) {
            if (typeof define === 'function' && define.amd) {
                // AMD
                define(['jquery', 'underscore'], factory);
            } else if (typeof exports === 'object') {
                // Node, CommonJS之类的
                module.exports = factory(require('jquery'), require('underscore'));
            } else {
                // 浏览器全局变量(root 即 window)
                root.returnExports = factory(root.jQuery, root._);
            }
        }(this, function ($, _) {
            //    方法
            function a(){};    //    私有方法，因为它没被返回 (见下面)
            function b(){};    //    公共方法，因为被返回了
            function c(){};    //    公共方法，因为被返回了

            //    暴露公共方法
            return {
                b: b,
                c: c
            }
        }));
```

#### AMD与CMD区别

**1、AMD推崇依赖前置，在定义模块的时候就要声明其依赖的模块** 
**2、CMD推崇就近依赖，只有在用到某个模块的时候再去require** 

AMD和CMD最大的区别是对依赖模块的执行时机处理不同，注意不是加载的时机或者方式不同

同样都是异步加载模块，AMD在加载模块完成后就会执行改模块，所有模块都加载执行完后会进入require的回调函数，执行主逻辑，这样的效果就是依赖模块的执行顺序和书写顺序不一定一致，看网络速度，哪个先下载下来，哪个先执行，但是主逻辑一定在所有依赖加载完成后才执行

CMD加载完某个依赖模块后并不执行，只是下载而已，在所有依赖模块加载完成后进入主逻辑，遇到require语句的时候才执行对应的模块，这样模块的执行顺序和书写顺序是完全一致的

这也是很多人说AMD用户体验好，因为没有延迟，依赖模块提前执行了，CMD性能好，因为只有用户需要的时候才执行的原因

#### ES6 Module

ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，旨在成为浏览器和服务器通用的模块解决方案。其模块功能主要由两个命令构成：`export`和`import`。`export`命令用于规定模块的对外接口，`import`命令用于输入其他模块提供的功能。

如上例所示，使用`import`命令的时候，用户需要知道所要加载的变量名或函数名。其实ES6还提供了`export default`命令，为模块指定默认输出，对应的`import`语句不需要使用大括号。这也更趋近于AMD的引用写法。

ES6的模块不是对象，`import`命令会被 JavaScript 引擎静态分析，在编译时就引入模块代码，而不是在代码运行时加载，所以无法实现条件加载。也正因为这个，使得静态分析成为可能。

#### ES6 模块与 CommonJS 模块的差异

**CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。**

- CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
- ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令`import`，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的`import`有点像 Unix 系统的“符号连接”，原始值变了，`import`加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

**CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。**

- 运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。

- 编译时加载: ES6 模块不是对象，而是通过 `export` 命令显式指定输出的代码，`import`时采用静态命令的形式。即在`import`时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。

CommonJS 加载的是一个对象（即`module.exports`属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成

- 总结:

| 区别项                                              | es模块化                                                     | commonJS                                           | AMD    |
| --------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------- | ------ |
| 可用于服务端还是浏览器                              | 服务端和浏览器                                               | 服务端                                             | 浏览器 |
| 模块依赖关系何时确定(即：何时加载模块)              | 编译时                                                       | 运行时                                             | 运行时 |
| 设计思想                                            | 尽量的静态化                                                 |                                                    |        |
| 模块是不是对象                                      | 不是                                                         | 是                                                 |        |
| 是否整体加载模块(即加载的所有方法)                  | 否                                                           | 是                                                 |        |
| 是否是动态更新(即通过接口,可以取到模块内部实时的值) | 是。es module输出的是值的引用                                | 不是。commonJS模块输出的是值的拷贝，不存在动态更新 |        |
| 模块变量是否是只读的                                | v是。原因：ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。 |                                                    |        |

- commonJS模块就是对象，整体加载模块（即加载的所有方法）
- ES6 模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入。
- export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系
- export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时
- export命令和import命令可以出现在模块的任何位置，只要处于模块顶层就可以。 如果处于块级作用域内，就会报错，这是因为处于条件代码块之中，就没法做静态优化了，违背了ES6模块的设计初衷。
- import命令具有提升效果，会提升到整个模块的头部，首先执行。