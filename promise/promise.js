function Promise (fn) {
	let value = null,
		state = 'pending',
		resolveCallbacks = [],
		rejectCallbacks = [];
	this.then = function (onFulfilled, onRejected) {
		handle({
			onFulfilled: typeof onFulfilled === 'function' ? onFulfilled : null,
			onRejected: typeof onRejected === 'function' ? onRejected : null
		})
		return this
	}

	function handle(cb) {
		console.log(state);
		if (state === 'pending') {
			resolveCallbacks.push(cb);
			rejectCallbacks.push(cb);
			return ;
		}
		if (!cb.onFulfilled || !cb.onRejected) {
			// cb.resolve(value);
			return ;
		}
		if (state === 'fulfilled') {
			value = cb.onFulfilled(value);
		} else {
			value = cb.onRejected(value);
		}
	}

	function resolve(newValue) {
		if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
			let then = newValue.then;
			// console.log(then);
			if (typeof then === 'function') {
				then.call(newValue, resolve);
				return ;
			}
		}
		setTimeout(() => {
			value = newValue;
			if (state === 'pending') {
				state = 'fulfilled';
			}
			resolveCallbacks.forEach(cb => {
				// console.log(cb);
				handle(cb)
			})
		}, 0);
	}
	function reject (error) {
		setTimeout(() => {
			state = 'rejected';
			value = error;
			rejectCallbacks.forEach(cb => {
				handle(cb);
			})
		}, 0);
	}
	fn(resolve, reject)
}

function testPromise () {
	return new Promise((resolve, reject) =>{
		// console.log('test');
		resolve('test');
	})
}

new Promise((resolve, reject) =>{
	console.log(111);
	// resolve(testPromise);
	reject(3);
	console.log(222);
}).then(val => {
	console.log(val, 2);
	return 5;
}, err => {
	console.log(err)
	return 444;
}).then(v => {
	console.log(v);
}, err => {
	console.log(err);
}).then(2)