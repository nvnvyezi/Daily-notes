### 依赖收集（getter相关）

#### 1. new Dep()实例化一个Dep类（内部是对Watcher的管理）
> 在Dep类中有个静态属性target，它定义的是全局唯一的Watcher，这样是为了保证同一时间只能有一个Watcher被计算；还有个subs数组，内部维护Watcher

#### 2. $mount() -> vm._render() 
> Vue的$mount挂载el时会先调用vm._render()方法，并实例化一个Watcher。vm._render()方法会将实例渲染生成虚拟Node，在这个过程中会对vm上的数据访问，这个时候就触发了数据对象的getter完成依赖收集

#### 4. 依赖收集
> 具体的依赖收集就是Watcher实例会将自己加入到对应数据的Observer的Dep实例的subs数组中去

#### 5. Watcher类实例化的四个时机
- Vue实例化的过程中有watch选项的
- Vue实例化的过程中有computed属性的
- Vue原型上直接通过实例调用this.$watch
- Vue生成render函数更新视图

#### !!!注意：Vue在添加完新的依赖后会移除旧的依赖，之所以这么做是为了，在使用v-if渲染子模板a和b的时候，如果在渲染b模板的时候添加了b的依赖，这个时候又修改a模板的数据，那a模板的数据订阅的回调已经被删除了，这样子就不会有浪费。

#### 6. 清除依赖：cleanDeps()
> 首先遍历deps，先移除对deps的订阅，接着交换newDepIds和depIds以及newDeps和deps，再把newDepIds和newDeps清空。