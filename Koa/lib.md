### 简介

Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

### 主要结构

```json
//lib下的四个文件
aoolication.js
context.js
request.js
response.js
```

### application.js

```js
/*整体结构*/
module.exports = class Aplication extends Emitter{ 
//...
}
```

这是koa的入口文件，继承了`events`一系列的监听和触发事件的能力。 在`new Koa()`（class。使用new继承）之后，一些事件比如`ues`, `listen`,`callback`等都在这个文件暴漏出来

### 依赖

- only：传进去一个对象和key（数组或者字符串），返回对象中存在key对应的值
- is-generator-function：判断是否是生成器函数，
- on-finished：当请求关闭结束或者错误时执行回调
- koa-is-json: 检查传入的参数是否为json
- statuses：将http码分为三类，redirect、empty以及retry，然后根据传入的http来判断属于哪一类
- koa-compose：
- events：事件监听和触发
- util：主要用于支持 Node.js 内部 API 的需求
- koa-convert：将koa1包中使用的Generator函数转换成Koa2中的async函数
- debug：调试

### 方法

##### listen

```js
listen(...args) {
  debug('listen');
  const server = http.createServer(this.callback());
  return server.listen(...args);
 }
```

可以看出来是对`http.createServer`进行了封装，而自己使用http搭建koa服务的时候，要使用`app.callback`，与直接使用`listen`是一样的

##### use

```js
 use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) {
      //提示应该将generator替换为async
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this;
  }
```

判断是否是函数以及如果是生成器函数将使用convert进行转换，最后将中间件push进middleware

##### callback

```js
callback() {
  //使用compose对中间件进行组合
    const fn = compose(this.middleware);
    if (!this.listenerCount('error')) this.on('error', this.onerror);
    const handleRequest = (req, res) => {
      //对req和res进行处理。返回一个新的ctx
      const ctx = this.createContext(req, res);
      //对请求进行处理，里面只要使用了respond方法，根据body的状态进行返回
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }
```

####compose具体做了啥

##### compoose

```js
//主要代码，前面主要是判断了middleware是数组，以及数组的元素都是函数
/**
* context：koa中的ctx
* next：所有中间件执行完后，最后处理请求和返回的回调函数。同时采用递归的方式不断的运行中间件。
*/
return function (context, next) {
    // 闭包，声明index判断是否进行多次调用next
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      //指针后移，指向下一个中间件
      let fn = middleware[i]
      //在所有中间件执行完后，执行next
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        //递归调用中间件
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
```

接下来看一个例子

```js
const Koa = require('Koa')
const http = require('http')
const app = new Koa()
app.use(async (ctx, next) => {
  console.log(222)
  await next()
  console.log(333)
})
app.use(async (ctx, next) => {
  console.log(444)
  await next()
  console.log(555)
})
app.use(async (ctx) => {
  console.log(666)
  ctx.body = 'hello'
})
http.createServer(app.callback()).listen(9999)
//222
//444
//666
//555
//333
```

结合compose源码来看，先执行`dispatch(0)`，进入dispatch以后，

```js
//执行到这里，fn就是第一个中间件的函数，context就是ctx，dispatch.bind(null, i+1)作为下一个中间件的next，
// async函数会返回一个Promise对象，而Promise.resolve()中若传入一个Promise对象的话，那么Promise.resolve将不做任何修改、原封不动地返回这个Promise对象。
return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
```

随后在打印222以后，等待next执行，这次的next就是下一个中间件函数，接着依次执行所有的中间件，在最后一个中间件执行完成后

```js
//符合这个条件，最后一个中间件的next返回了，开始依次执行上面等待的中间件
if (i === middleware.length) fn = next
if (!fn) return Promise.resolve()
```

##### inspect

实际调用了`toJson`方法,输出显示设置的json表示即`proxy`，`env`，`subdomainOffset`的值,

> subdomainOffset
>
> 假设域名是"tobi.ferrets.example.com"。如果app.subdomainOffset没有设置，也就是说默认要忽略的偏移量是2，那么ctx.subdomains是["ferrets", "tobi"]。如果为3，则值是tobi

### 错误处理机制

在context.js里面，onerror或触发一个error事件

```js
onerror(err) {
  this.app.emit('error', err, this);
}
```

而要做到统一处理则在application.js里面

```js
handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```

在这个函数里面只要中间件处理中出现错误就会被catch捕捉到，而在compose的处理过程中出现错误，会被Promise.reject(err)抛出来,最后同样会被catch捕捉到，从而触发onerror函数里面的error事件。

### context

创建上下文原型，通过`delegate`将req和res的方法代理，这样就可以直接在ctx访问方法。

### request.js、response.js

对原生的res、req进行操作，使用es6的`get`和`set`，进行一系列对req，和res上的属性设置或者获取

### 依赖

- delegates：把一个对象上的方法，属性委托到另一个对象上
- http-errors：创建http错误
- cookies：用于获取和设置HTTP(S)cookie
- http-assert：断言状态代码

