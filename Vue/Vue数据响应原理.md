### 数据响应原理

#### 1. new Vue() -> this._init() -> initState(vm)
> 首先，我们在new Vue()的时候实例化Vue，实际是在源码内部是调用this._init()方法完成的初始化，而_init()方法它内部是执行了一个initState(vm)方法完成了Vue实例初始化阶段的工作：初始化data，props，methods，computed，watcher等，这里我们主要说initData()和initProps()，computed单独拎出来讲。

#### 2. initData() / initProps() [proxy()]
> 初始化data和props分别是由initData()和initProps()完成的，这俩方法其实内部实现没多大差，俩方法都调用了proxy()方法实现了数据的代理，也就是vm._data.xxx = vm.xxx和vm._props.xxx = vm.xxx，其实现原理就是Object.defineProperty()；除了实现代理数据以外，initData()和initProps()对于数据响应式的实现分别是调用的observe()和defineReactive()。defineReactive()在observe中也有调用，后面讲observe的时候会提到。

#### 3. observe() -> Oberver类 -> walk() -> defineReactive()
> observe()方法实现的就是监测数据变动，给所有非VNode对象实例化一个Observer类；Observer类它首先会对value作判断，如果是数组的话就调用observeArray()方法，其实就是遍历数组递归调用observe()，如果是纯对象的话就直接调用walk方法；walk()方法在遍历对象属性的时候调用了defineReactive()，defineReactive()方法所做的工作就是初始化一个Dep类的实例，拿到对象的属性描述符，对子对象递归调用observe()，这样就保证了无论对象结构多复杂，它的所有子属性都能变成响应式对像，它也是利用Object.defineProperty给对象属性添加getter和setter来实现数据的 *依赖收集* 和 *派发更新*。