### RxJS 中用来解决异步事件管理的的基本概念

- **Observable (可观察对象):** 表示一个概念，这个概念是一个可调用的未来值或事件的集合。
- **Observer (观察者):** 一个回调函数的集合，它知道如何去监听由 Observable 提供的值。
- **Subscription (订阅):** 表示 Observable 的执行，主要用于取消 Observable 的执行。
- **Operators (操作符):** 采用函数式编程风格的纯函数 (pure function)，使用像 `map`、`filter`、`concat`、`flatMap` 等这样的操作符来处理集合。
- **Subject (主体):** 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式。
- **Schedulers (调度器):** 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 `setTimeout` 或 `requestAnimationFrame` 或其他。

### Observer（观察者）

观察者是由observable发送的值的消费者，观察者只是一组回调函数的集合，每个回调函数对应一种Observable发送的通知类型： `next`,`complete`, `error`

RxJS 中的观察者也可能是*部分的*。如果你没有提供某个回调函数，Observable 的执行也会正常运行，只是某些通知类型会被忽略，因为观察者中没有相对应的回调函数。

### Subscription（订阅）

Subscription 是表示可清理资源的对象，通常是 Observable 的执行。Subscription 有一个重要的方法，即 `unsubscribe`，它不需要任何参数，只是用来清理由 Subscription 占用的资源。在上一个版本的 RxJS 中，Subscription 叫做 "Disposable" (可清理对象)。

Subscription 还可以合在一起，这样一个 Subscription 调用 `unsubscribe()` 方法，可能会有多个 Subscription 取消订阅 。

````js
suba.add(subb)
````

Subscriptions 还有一个 `remove(otherSubscription)` 方法，用来撤销一个已添加的子 Subscription 。

### Subject（主体）

RxJS Subject 是一种特殊类型的 Observable，它允许将值多播给多个观察者，所以 Subject 是多播的，而普通的 Observables 是单播的(每个已订阅的观察者都拥有 Observable 的独立执行)。

**每个 Subject 都是 Observable 。** - 对于 Subject，你可以提供一个观察者并使用 `subscribe` 方法，就可以开始正常接收值。从观察者的角度而言，它无法判断 Observable 执行是来自普通的 Observable 还是 Subject 。

在 Subject 的内部，`subscribe` 不会调用发送值的新执行。它只是将给定的观察者注册到观察者列表中，类似于其他库或语言中的 `addListener` 的工作方式。

**每个 Subject 都是观察者。** - Subject 是一个有如下方法的对象： `next(v)`、`error(e)` 和 `complete()` 。要给 Subject 提供新值，只要调用 `next(theValue)`，它会将值多播给已注册监听该 Subject 的观察者们

### 多播的Observables

“多播 Observable” 通过 Subject 来发送通知，这个 Subject 可能有多个订阅者，然而普通的 “单播 Observable” 只发送通知给单个观察者。

多播 Observable 在底层是通过使用 Subject 使得多个观察者可以看见同一个 Observable 执行。

在底层，这就是 `multicast` 操作符的工作原理：观察者订阅一个基础的 Subject，然后 Subject 订阅源 Observable 。

`multicast` 操作符返回一个 Observable，它看起来和普通的 Observable 没什么区别，但当订阅时就像是 Subject 。`multicast` 返回的是 `ConnectableObservable`，它只是一个有 `connect()` 方法的 Observable 。

`connect()` 方法十分重要，它决定了何时启动共享的 Observable 执行。因为 `connect()` 方法在底层执行了 `source.subscribe(subject)`，所以它返回的是 Subscription，你可以取消订阅以取消共享的 Observable 执行。

### 引用计数

手动调用 `connect()` 并处理 Subscription 通常太笨重。通常，当第一个观察者到达时我们想要*自动地*连接，而当最后一个观察者取消订阅时我们想要*自动地*取消共享执行。

```js
const source = interval(500);
const multicasted = source.pipe(multicast(() => new Subject()));
let sub1, sub2, sub3;
sub1 = multicasted.subscribe({
  next: x => console.log(`a${x}`)
});
sub3 = multicasted.connect();
setTimeout(() => {
  sub2 = multicasted.subscribe({
    next: x => console.log(`b${x}`)
  });
}, 600);
setTimeout(() => {
  sub1.unsubscribe();
}, 1400);
setTimeout(() => {
  sub2.unsubscribe();
  sub3.unsubscribe();
}, 1900);
//a0 a1 b1 b2
```

如果不想显式调用 `connect()`，我们可以使用 ConnectableObservable 的 `refCount()` 方法(引用计数)，这个方法返回 Observable，这个 Observable 会追踪有多少个订阅者。当订阅者的数量从`0`变成`1`，它会调用 `connect()` 以开启共享的执行。当订阅者数量从`1`变成`0`时，它会完全取消订阅，停止进一步的执行。

> `refCount` 的作用是，当有第一个订阅者时，多播 Observable 会自动地启动执行，而当最后一个订阅者离开时，多播 Observable 会自动地停止执行。

```js
const source = interval(500);
const multicasted = source.pipe(
  multicast(() => new Subject()),
  refCount()
);
const sub1 = multicasted.subscribe({
  next: x => console.log(`a${x}`)
});

let sub2;
setTimeout(() => {
  sub2 = multicasted.subscribe({
    next: x => console.log(`b${x}`)
  });
}, 600);

setTimeout(() => {
  sub1.unsubscribe();
}, 1100);
setTimeout(() => {
  sub2.unsubscribe();
}, 1600);
```

`refCount()` 只存在于 ConnectableObservable，它返回的是 `Observable`，而不是另一个 ConnectableObservable 。

### BehaviorSubject

Subject 的其中一个变体就是 `BehaviorSubject`，它有一个“当前值”的概念。它保存了发送给消费者的最新值。并且当有新的观察者订阅时，会立即从 `BehaviorSubject` 那接收到“当前值”。
BehaviorSubjects适合用来表示“随时间推移的值”。举例来说，生日的流是一个 Subject，但年龄的流应该是一个 BehaviorSubject 。

```js
const subject = new BehaviorSubject(0);//0是初始值
subject.subscribe({
  next: x => console.log(x)
});
subject.next(1);
subject.next(4);
subject.subscribe({
  next: x => console.log(`b${x}`)
});
subject.next(2);
```

### ReplaySubject

`ReplaySubject` 类似于 `BehaviorSubject`，它可以发送旧值给新的订阅者，但它还可以*记录* Observable 执行的一部分。

`ReplaySubject` 记录 Observable 执行中的多个值并将其回放给新的订阅者。

```js
const subject = new ReplaySubject(2); //为新的订阅者缓冲2个值
subject.subscribe({
  next: x => console.log(`a${x}`)
});
subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);
subject.subscribe({
  next: x => console.log(`b${x}`)
});
subject.next(5);
const subject = new ReplaySubject(200, 400); //缓冲400毫秒时间内的值
```

### AsyncSubject

AsyncSubject 是另一个 Subject 变体，只有当 Observable 执行完成时(执行 `complete()`)，它才会将执行的最后一个值发送给观察者。

```js
const subject = new AsyncSubject();
subject.subscribe({
  next: x => console.log(`a${x}`)
});
subject.next(4);
subject.subscribe({
  next: x => console.log(`b${x}`)
});
subject.next(5);
subject.complete();
```

### 操作符

操作符是 Observable 类型上的**方法**，比如 `.map(...)`、`.filter(...)`、`.merge(...)`，等等。当操作符被调用时，它们不会**改变**已经存在的 Observable 实例。相反，它们返回一个**新的** Observable ，它的 subscription 逻辑基于第一个 Observable 。

> 操作符是函数，它基于当前的 Observable 创建一个新的 Observable。这是一个无副作用的操作：前面的 Observable 保持不变。

操作符本质上是一个纯函数 (pure function)，它接收一个 Observable 作为输入，并生成一个新的 Observable 作为输出。订阅输出 Observable 同样会订阅输入 Observable 。

```js
// 将值+1
function test() {
  const source = add(from([1, 2, 4]));
  source.subscribe({
    next: x => console.log(x)
  });
}
function add(input) {
  const output = Observable.create(observer => {
    input.subscribe({
      next: x => observer.next(1 + x)
    });
  });
  return output;
}
```

> 订阅output会导致input observer也被订阅，称之为操作符订阅链

#### 实例操作符

通常提到操作符时，我们指的是**实例**操作符，它是 Observable 实例上的方法

> 实例运算符是使用 `this` 关键字来指代输入的 Observable 的函数

#### 静态操作符

静态操作符是直接附加到 Observable 类上的。静态操作符在内部不使用 `this` 关键字，而是完全依赖于它的参数。

静态操作符是附加到 Observalbe 类上的纯函数，通常用来从头开始创建 Observalbe 。

最常用的静态操作符类型是所谓的**创建操作符**。它们只接收非 Observable 参数，比如数字，然后**创建**一个新的 Observable ，而不是将一个输入 Observable 转换为输出 Observable 。

一个典型的静态操作符例子就是 `interval` 函数。它接收一个数字(非 Observable)作为参数，并生产一个 Observable 作为输出



#### interval

基于给定时间间隔发出数字序列。返回一个发出无限自增的序列整数，可以选择固定的时间间隔进行发送。第一次并没有立马发送，而是第一个时间段之后才发出。

#### timer

创建一个Observable，该Observable在初始延时之后开始发送并且在每个时间周期后发出自增的数字。

timer返回一个发出无限自增数列的`observable`，具有一定的时间间隔，这个间隔可以是提供的毫秒，也可以是某个`Date`类型的时间，当延时到某个时间（某个日期）的时候开始发出值。默认情况下使用`async`调度器来提供时间的概念，但是也可以传递任何调度器。如果时间周期没有被指定，输出`observable`只发出0，否则会发出一个无限数列

#### delay

简单地延迟每个要发出的值

一个很好的场景是错误处理，尤其是当网络不稳定时我们想要在x毫秒后重试整个流

#### from

将数组、promise 或迭代器转换成 observable 。

- 对于数组和迭代器，所有包含的值都会被作为序列发出！
- 此操作符也可以用来将字符串作为字符的序列发出！

#### switchMap

映射成 observable，完成前一个内部 observable，发出值。

`switchMap` 和其他打平操作符的主要区别是它具有取消效果。在每次发出时，会取消前一个内部 observable (你所提供函数的结果) 的订阅，然后订阅一个新的 observable 。你可以通过短语**切换成一个新的 observable**来记忆它。

它能在像 [typeaheads](https://angular-2-training-book.rangle.io/handout/http/search_with_switchmap.html) 这样的场景下完美使用，当有新的输入时便不再关心之前请求的响应结果。在内部 observable 长期存活可能会导致内存泄露的情况下，这也是一种安全的选择，例如，如果你使用 [mergeMap](https://rxjs-cn.github.io/learn-rxjs-operators/operators/transformation/mergemap.html)和 interval，并忘记正确处理内部订阅。记住，`switchMap` 同一时间只维护一个内部订阅

#### fromEvent

将事件转换成 observable 序列。

#### takeUntil

发出值，直到提供的 observable 发出值，它便完成。

### 参考

[文档](https://cn.rx.js.org/manual/overview.html#h29)

[rxjs操作符文档](https://rxjs-cn.github.io/learn-rxjs-operators/operators/multicasting/publish.html)