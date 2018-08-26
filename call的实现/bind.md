该`**bind()**`方法创建一个新函数，在调用时，将其`this`关键字设置为提供的值，并在调用新函数时提供任何前面提供的给定参数序列。

```
function.bind（thisArg [，arg1 [，arg2 [，...]]]）
```

### 参数

- `thisArg`

  `this`调用绑定函数时作为参数传递给目标函数的值。如果使用[`new`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)运算符构造绑定函数，则忽略该值。

- `arg1, arg2, ...`

  在调用目标函数时预先添加到绑定函数的参数的参数。

### 返回值

具有指定**this**值和初始参数的给定函数的副本。

```
Function.prototype.bind1 = function(context) {
  if (typeof this !== "function") {
    throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
  }
  let self = this;
  let args = Array.from(arguments).slice(1);
  let Fn = function () {};
  let bound = function () {
    let ctxArgs = Array.from(arguments);
    self.apply(this instanceof self ? this : context, args.concat(ctxArgs));
  }
  Fn.prototype = this.prototype;
  bound.prototype = new Fn();
  return bound;
}


let obj = {
  name: 'sd'
}

function say (num, age) {
  console.log(this.name, num, age)
}

say.bind1(obj, 'sd', 16);
```

// 当作为构造函数时，this 指向实例，self 指向绑定函数，因为下面一句 `fn.prototype = this.prototype;`，已经修改了 fn.prototype 为 绑定函数的 prototype，此时结果为 true，当结果为 true 的时候，this 指向实例。         // 当作为普通函数时，this 指向 window，self 指向绑定函数，此时结果为 false，当结果为 false 的时候，this 指向绑定的 context。

 

## 三个小问题

接下来处理些小问题:

**1.apply 这段代码跟 MDN 上的稍有不同**

在 MDN 中文版讲 bind 的模拟实现时，apply 这里的代码是：

```
self.apply(this instanceof self ? this : context || this, args.concat(bindArgs))复制代码
```

多了一个关于 context 是否存在的判断，然而这个是错误的！

举个例子：

```
var value = 2;
var foo = {
    value: 1,
    bar: bar.bind(null)
};

function bar() {
    console.log(this.value);
}

foo.bar() // 2复制代码
```

以上代码正常情况下会打印 2，如果换成了 context || this，这段代码就会打印 1！

所以这里不应该进行 context 的判断，大家查看 MDN 同样内容的英文版，就不存在这个判断！

**2.调用 bind 的不是函数咋办？**

不行，我们要报错！

```
if (typeof this !== "function") {
  throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
}复制代码
```

**3.我要在线上用**

那别忘了做个兼容：

```
Function.prototype.bind = Function.prototype.bind || function () {
    ……
};
```

