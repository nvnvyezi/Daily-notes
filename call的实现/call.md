[参考一](https://juejin.im/post/5907eb99570c3500582ca23c)

### **call**

该`**call()**`方法调用具有给定`this`值的函数和单独提供的参数。

```
function.call(thisArg, arg1, arg2, ...)
```

### 参数

- `thisArg`

  可选的。`this`为呼叫提供  的值*function*。注意，`this`可能不是方法看到的实际值：如果方法[是非严格模式下](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode)的函数，[`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)并且[`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)将被全局对象替换，则原始值将被转换为对象。

- `arg1, arg2, ...`

  可选的。函数的参数。

 **例子**

```
function First (a, b) {
  this.a = a;
  this.b =b;
}

function Second (a, b) {
  First.call(this, a, b);
  this.c = '12';
}

let test = new Second('s', 'd');

console.log(test)
//Second { a: 's', b: 'd', c: '12' }
```

### **ok，正文开始**

```
function say() {
  console.log(this.name);
}

let obj = {
  name: 'sd'
}

say.call(obj);
//sd
```

1. call 改变了 this 的指向，指向到 foo
2. 函数立即执行了

那不用call怎么实现呢

```
let obj = {
  name: 'sd',
  say: function () {
    console.log(this.name);
  }
};

obj.say();
//"sd"
```

这样就实现效果了，不过obj多了一个属性，删掉它，好的，ok

1. 将函数设为对象的属性
2. 执行该函数
3. 删除该函数

```

Function.prototype.call1 = function (context) {
  context.fn = this;
  context.fn();
  delete context.fn;
}

let obj = {
  name: 'sd'
}

function say() {
  console.log(this.name);
}

say.call1(obj);
//sd
```

上面这段代码就是模拟我们上面实现的那三 步，ok，我们已经实现了this绑定，那还有参数呢，请往下看

```
Function.prototype.call1 = function (context) {
  let arr = [];
  for (let i = 1; i < arguments.length; i++) {
    arr.push(arguments[i])
  }
  context.fn = this;
  context.fn(...arr);
  delete context.fn;
}

let obj = {
  name: 'sd'
}

function say(age, str) {
  console.log(this.name);
  console.log(age, str);
}

say.call1(obj, 15, 'lu');
```

ok，还差最后一步，传入null或者函数有返回值

```
Function.prototype.call1 = function (context) {
  let arr = [];
  // for (let i = 1; i < arguments.length; i++) {
  //   arr.push(arguments[i])
  // }
  context = context || window;
  arr = Array.from(arguments).slice(1);
  context.fn = this;
  let res = context.fn(...arr);
  delete context.fn;
  return res
}

let obj = {
  name: 'sd'
}

var name = 'oi';
function say(age, str) {
  console.log(this.name);
  console.log(age, str);
  return age;
}

say.call1(obj, 15, 'lu');
let res = say.call1(null, 15, 'lu');
console.log(res)
```

![1533048578138](/tmp/1533048578138.png)

