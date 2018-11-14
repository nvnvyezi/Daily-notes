# promiese

[来源](https://blog.csdn.net/qq_22844483/article/details/73655738)

### **最简单的形态**

```js
function Promise(fn) {
    var value = null,
        callbacks = [];  //callbacks为数组，因为可能同时有很多个回调

    this.then = function (onFulfilled) {
        callbacks.push(onFulfilled);
    };

    function resolve(value) {
        callbacks.forEach(function (callback) {
            callback(value);
        });
    }

    fn(resolve);
}
```

- 调用then方法，将想要在Promise异步操作成功时执行的回调放入callbacks队列，其实也就是注册回调函数，可以向观察者模式方向思考；

- 创建Promise实例时传入的函数会被赋予一个函数类型的参数，即resolve，它接收一个参数value，代表异步操作返回的结果，当一步操作执行成功后，用户会调用resolve方法，这时候其实真正执行的操作是将callbacks队列中的回调一一执行；

### **链式调用**

```js
this.then = function (onFulfilled) {
    callbacks.push(onFulfilled);
    return this;
};
```



### **延时机制**

```js
function Promise (fn) {
	let value  = null;
	let callbacks = [];
	this.then = function (onFulfilled) {
		callbacks.push(onFulfilled);
		console.log(callbacks)
		return this;
	}
	console.log(callbacks)
	function resolve (value) {
		console.log(3332)
		// setTimeout(() => {
			console.log(555)
			callbacks.forEach(function (callback) {  
				callback(value);
			})
		// }, 0);
	}
	fn(resolve);
};

function pro () {
	return  new Promise((resolve) => {
		console.log(333);
		console.log(resolve)
		resolve(22)
	})
}

pro().then(function (id) {
	console.log(id) 
	console.log(222)
 }).then (() => {
	 console.log(888)
 })
```



大家会发现在then注册之前  resolve 就执行了

因此我们要加入一些处理，保证在resolve执行之前，then方法已经注册完所有的回调.就是加上settimeout,不明白的可以看看js事件轮询

**但是，这样好像还存在一个问题，可以细想一下：如果Promise异步操作已经成功，这时，在异步操作成功之前注册的回调都会执行，但是在Promise异步操作成功这之后调用的then注册的回调就再也不会执行了，这显然不是我们想要的。**



### **加入状态**

为了解决上一节抛出的问题，我们必须加入状态机制，也就是大家熟知的pending、fulfilled、rejected。

Promises/A+规范中的2.1Promise States中明确规定了，pending可以转化为fulfilled或rejected并且只能转化一次，也就是说如果pending转化到fulfilled状态，那么就不能再转化到rejected。并且fulfilled和rejected状态只能由pending转化而来，两者之间不能互相转换。

![è¿éåå¾çæè¿°](https://img-blog.csdn.net/20170623195800157?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMjI4NDQ0ODM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)



```js
function Promise (fn) {
	let value  = null;
	let state = 'pending';
	let callbacks = [];

	this.then = function (onFulfilled) {
		if (state === 'pending') {
			callbacks.push(onFulfilled);
			console.log(callbacks)
			return this;
		}
		onFulfilled(value);
		return this;
	}
	console.log(callbacks)
	function resolve (newValue) {
		value = newValue;
		state = 'fulfilled';
		console.log(3332)
		setTimeout(() => {
			console.log(555)
			console.log(callbacks, 444)
			callbacks.forEach(function (callback) {  
				callback(value);
			})
		}, 0);
	}
	fn(resolve);
};

function pro () {
	return  new Promise((resolve) => {
		console.log(333);
		resolve(22)
	})
}

pro().then(function (id) {
	console.log(id) 
	console.log(222)
 }).then (() => {
	 console.log(888)
 })
```



resolve执行时，会将状态设置为fulfilled，在此之后调用then添加的新回调，都会立即执行。

### 链式**Promise**

比如

```js
getUserId()
    .then(getUserJobById)
    .then(function (job) {
        // 对job的处理
    });

function getUserJobById(id) {
    return new Promise(function (resolve) {
        http.get(baseUrl + id, function(job) {
            resolve(job);
        });
    });
}
```

- 链式Promise是指在当前promise达到fulfilled状态后，即开始进行下一个promise（后邻promise）

```js
function Promise (fn) {
	let value  = null;
	let state = 'pending';
	let callbacks = [];

	this.then = function (onFulfilled) {
		return new Promise (function (resolve) {  
			handle({
				onFulfilled: onFulfilled || null,
				resolve: resolve
			})
		})
	}

	function handle(callback) {
		if (state === 'pending') {
			callbacks.push(onFulfilled);
			console.log(callbacks)
			return this;
		}
		if (!callback.onResolved) {
			callback.resolve(value);
			return;
		}
		let ret = callback.onFulfilled(value);
		// onFulfilled(value);
		// return this;
		callback.resolve(ret);
	}

	console.log(callbacks, 2)
	function resolve (newValue) {
		if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
			let then = newValue.then;
			if (typeof then === 'function') {
				then.call(newValue, resolve);
				return ;
			}
		}
		value = newValue;
		state = 'fulfilled';
		console.log(3332)
		setTimeout(() => {
			console.log(555)
			console.log(callbacks, 444)
			callbacks.forEach(function (callback) {  
				handle(value);
			})
		}, 0);
	}

	fn(resolve);
};

function pro () {
	return  new Promise((resolve) => {
		console.log(333);
		resolve(22)
	})
}

pro().then(function (id) {
	console.log(id) 
	console.log(222)
 })
```

1. then方法中，创建并返回了新的Promise实例，这是串行Promise的基础，并且支持链式调用。
2. handle方法是promise内部的方法。then方法传入的形参onFulfilled以及创建新Promise实例时传入的resolve均被push到当前promise的callbacks队列中，这是衔接当前promise和后邻promise的关键所在（这里一定要好好的分析下handle的作用）。
3. getUserId生成的promise（简称getUserId promise）异步操作成功，执行其内部方法resolve，传入的参数正是异步操作的结果id
4. 调用handle方法处理callbacks队列中的回调：getUserJobById方法，生成新的promise（getUserJobById promise）
5. 执行之前由getUserId promise的then方法生成的新promise(称为bridge promise)的resolve方法，传入参数为getUserJobById promise。这种情况下，会将该resolve方法传入getUserJobById promise的then方法中，并直接返回。
6. 在getUserJobById promise异步操作成功时，执行其callbacks中的回调：getUserId bridge promise中的resolve方法
7. 最后执行getUserId bridge promise的后邻promise的callbacks中的回调。

![img](https://sfault-image.b0.upaiyun.com/230/609/2306098513-591e78acb8b0c)



### **失败处理**

```js
function Promise (fn) {
	let value  = null;
	let state = 'pending';
	let callbacks = [];

	this.then = function (onFulfilled, onRejected) {
		return new Promise (function (resolve) {  
			handle({
				onFulfilled: onFulfilled || null,
				onRejected: onRejected || null,
				resolve: resolve,
				reject: reject
			})
		})
	}

	function handle(callback) {
		console.log(8989, state)
		if (state === 'pending') {
			callbacks.push(onFulfilled);
			console.log(callbacks)
			return this;
		}
		let cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected;
		let ret;
		if (cb === null) {
			cb = state === 'fulfilled' ? callback.resolve : callback.reject;
			cb(value);
			return ;
		}
		// let ret = callback.onFulfilled(value);
		ret = cb(value)
		// onFulfilled(value);
		// return this;
		callback.resolve(ret);
	}

	console.log(1111)
	function resolve (newValue) {
		if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
			let then = newValue.then;
			console.log(then, 000)
			if (typeof then === 'function') {
				then.call(newValue, resolve, reject);
				return ;
			}
		}
		value = newValue;
		state = 'fulfilled';
		console.log(3332);
		execute();
	}

	function reject (reason) {
		state = 'rejected';
		value = reason;
		execute();
	}

	function execute () {
		setTimeout(() => {
			console.log(callbacks, 444)
			callbacks.forEach(function (callback) {  
				handle(value);
			})
		}, 0);
	}

	fn(resolve, reject);
};

function pro () {
	return  new Promise((resolve) => {
		console.log(999)
		resolve(22)
	})
}

pro().then(function (id) {
	console.log(id)
	return new Promise (resolve => {
		console.log(123);
		resolve(678);
	})
 })
```

上述代码增加了新的reject方法，供异步操作失败时调用，同时抽出了resolve和reject共用的部分，形成execute方法。

错误冒泡是上述代码已经支持，且非常实用的一个特性。在handle中发现没有指定异步操作失败的回调时，会直接将bridge promise(then函数返回的promise，后同)设为rejected状态，如此达成执行后续失败回调的效果



### **异常处理**

```js
function handle(callback) {
    if (state === 'pending') {
        callbacks.push(callback);
        return;
    }
 
    var cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected,
        ret;
    if (cb === null) {
        cb = state === 'fulfilled' ? callback.resolve : callback.reject;
        cb(value);
        return;
    }
    try {
        ret = cb(value);
        callback.resolve(ret);
    } catch (e) {
        callback.reject(e);
    }
}
```

细心的同学会想到：如果在执行成功回调、失败回调时代码出错怎么办？对于这类异常，可以使用try-catch捕获错误，并将bridge promise设为rejected状态