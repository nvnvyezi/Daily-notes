#### Batch Update（批量更新）

![](1282377-20171216100036355-464944360.png)

将一段时间内的更新放到一起更新，而不是来一个就更新一次

#### React的transaction

![](1282377-20171216102032277-694932419.png)

> Transaction对一个函数进行包装，让React有机会在一个函数执行前和执行后运行特定的逻辑，从而完成对整个Batch Update流程的控制。
>
> 简单的说就是在要执行的函数中用事务包裹起来，在函数执行前加入initialize阶段，函数执行，最后执行close阶段。那么Batch Update中
>
> 在事件initialize阶段，一个update queue被创建。在事件中调用setState方法时，状态不会被立即调用，而是被push进Update queue中。
>
> 函数执行结束调用事件的close阶段，Update queue会被flush，这事新的状态才会被应用到组件上并开始后续的Virtual DOM更新，biff算法来对model更新。

#### Vue 实现Batch Update

> 默认情况下， Vue 的 DOM 更新是异步执行的。理解这一点非常重要。当侦测到数据变化时， Vue 会打开一个队列，然后把在同一个事件循环 (event loop) 当中观察到数据变化的 watcher 推送进这个队列。假如一个 watcher 在一个事件循环中被触发了多次，它只会被推送到队列中一次。然后，在进入下一次的事件循环时， Vue 会清空队列并进行必要的 DOM 更新。在内部，Vue 会使用 `MutationObserver` 来实现队列的异步处理，如果不支持则会回退到 `setTimeout(fn, 0)`。

借助JS的Event Loop

```js
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
//将观察者推到观察者队列中。
//重复的IDS作业将被跳过，除非它是当队列被刷新时被按下。
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      //如果已经冲洗，根据其ID拼接观察者。
			//如果已经过了它的ID，它将立即运行。
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}

```



#### setState干了什么

**官方介绍**

> Sets a subset of the state. Always use this to mutate
> state. You should treat this.state as immutable.
>
> There is no guarantee that this.state will be immediately updated, so
> accessing this.state after calling this method may return the old value.
>
> There is no guarantee that calls to setState will run synchronously,
> as they may eventually be batched together. You can provide an optional
> callback that will be executed when the call to setState is actually
> completed.
>
> setState用来设置`state`的子集，永远都只使用setState更改`state`。你应该将`this.state`视为不可变数据。
>
> 并不能保证this.state会被立即更新，因此在调用这个方法之后访问`this.state`可能会得到的是之前的值。
>
> 不能保证调用setState之后会同步运行，因为它们可能被批量更新，你可以提供可选的回调函数，在setState真正地完成了之后，回调函数将会被执行。



![](4fd1a155faedff00910dfabe5de143fc_hd.png)

- 依靠事务进行批量更新;
- 一次batch(批量)的生命周期就是从`ReactDefaultBatchingStrategy`事务perform之前(调用ReactUpdates.batchUpdates)到这个事务的最后一个close方法调用后结束;
- 事务启动后, 遇到 setState 则将 partial state 存到组件实例的_pendingStateQueue上, 然后将这个组件存到dirtyComponents 数组中, 等到 `ReactDefaultBatchingStrategy`事务结束时调用`runBatchedUpdates`批量更新所有组件;
- 组件的更新是递归的, 三种不同类型的组件都有自己的`updateComponent`方法来决定自己的组件如何更新, 其中 ReactDOMComponent 会采用diff算法对比子元素中最小的变化, 再批量处理.