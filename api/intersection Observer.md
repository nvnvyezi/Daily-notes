##### 使用方法

````js
var io = new IntersectionObserver(callback, option);
````

上面代码中，`IntersectionObserver`是浏览器原生提供的构造函数，接受两个参数：`callback`是可见性变化时的回调函数，`option`是配置对象（该参数可选）。

构造函数的返回值是一个观察器实例。实例的`observe`方法可以指定观察哪个 DOM 节点。

```` js
// 开始观察
io.observe(document.getElementById('example'));

// 停止观察
io.unobserve(element);

// 关闭观察器
io.disconnect();
````

上面代码中，`observe`的参数是一个 DOM 节点对象。如果要观察多个节点，就要多次调用这个方法。

````js
io.observe(elementA);
io.observe(elementB);
````

#####  二、callback 参数

目标元素的可见性变化时，就会调用观察器的回调函数`callback`。

`callback`一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）

````js
var io = new IntersectionObserver(
  entries => {
    console.log(entries);
  }
);
````

上面代码中，回调函数采用的是[箭头函数](http://es6.ruanyifeng.com/#docs/function#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0)的写法。`callback`函数的参数（`entries`）是一个数组，每个成员都是一个[`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)对象。举例来说，如果同时有两个被观察的对象的可见性发生变化，`entries`数组就会有两个成员。

##### 三、IntersectionObserverEntry 对象

`IntersectionObserverEntry`对象提供目标元素的信息，一共有六个属性

````js
{
  time: 3893.92,
  rootBounds: ClientRect {
    bottom: 920,
    height: 1024,
    left: 0,
    right: 1024,
    top: 0,
    width: 920
  },
  boundingClientRect: ClientRect {
     // ...
  },
  intersectionRect: ClientRect {
    // ...
  },
  intersectionRatio: 0.54,
  target: element
}
````

- `time`：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
- `target`：被观察的目标元素，是一个 DOM 节点对象
- `rootBounds`：根元素的矩形区域的信息，`getBoundingClientRect()`方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回`null`
- `boundingClientRect`：目标元素的矩形区域的信息
- `intersectionRect`：目标元素与视口（或根元素）的交叉区域的信息
- `intersectionRatio`：目标元素的可见比例，即`intersectionRect`占`boundingClientRect`的比例，完全可见时为`1`，完全不可见时小于等于`0`