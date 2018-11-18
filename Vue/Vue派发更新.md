### 派发更新

#### 1. 修改数据 -> 触发数据的setter -> setter触发对应数据的Observer的dep调用notify()

#### 2. notify()：遍历所有的subs（也就是watcher实例），调用每一个watcher的update()方法实现数据更新，Vue采用了queueWatcher去优化更新一般组件数据来达到异步执行DOM更新

#### 3. update()：更新视图