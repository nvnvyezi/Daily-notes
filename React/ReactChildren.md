包含`React.Chilren`上的方法

```js
export {
  forEachChildren as forEach,
  mapChildren as map,
  countChildren as count,
  onlyChild as only,
  toArray,
};

```

### map

```js
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  // 遍历出来的元素会丢到 result 中最后返回出去
  const result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}
function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  // 这里是处理 key，不关心也没事
  let escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  const traverseContext = getPooledTraverseContext(
    array,
    escapedPrefix,
    func,
    context,
  );
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}
```

`getPooledTraverseContext`和`releaseTraverseContext`合作维护了一个有10个对象的数组。避免了每次生成销毁对象，提高性能。

`mapSingleChildIntoContext`中调用了`traverseAllChildrenImpl`

```js
function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext,
) {
  // 这个函数核心作用就是通过把传入的 children 数组通过遍历摊平成单个节点
  const type = typeof children;
  if (type === 'undefined' || type === 'boolean') {
    children = null;
  }
  let invokeCallback = false;
  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;
      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }
    }
  }
  if (invokeCallback) {
    callback(
      traverseContext,
      children,
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar,
    );
    return 1;
  }
}
```

上面这段代码主要作用就是判读children是否是可渲染的节点，如果是直接调用`mapSingleChildIntoContext`

```js
/**
 * 这个函数只有当传入的 child 是单个节点是才会调用
 * @param bookKeeping 就是我们从对象池子里取出来的东西
 * @param child 传入的节点
 * @param childKey 节点的 key
 */
function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  const {result, keyPrefix, func, context} = bookKeeping;
  // func 就是我们在React.Children.map(this.props.children, c => c)中传入的第二个函数参数
  let mappedChild = func.call(context, child, bookKeeping.count++);
  // 判断函数返回值是否为数组
  // 因为可能会出现这种情况
  // React.Children.map(this.props.children, c => [c, c])
  // 对于 c => [c, c] 这种情况来说，每个子元素都会被返回出去两次
  // 也就是说假如有 2 个子元素 c1 c2，那么通过调用 React.Children.map(this.props.children, c => [c, c]) 后
  // 返回的应该是 4 个子元素，c1 c1 c2 c2
  if (Array.isArray(mappedChild)) {
    // 是数组的话就回到最先调用的函数中
    // 然后回到之前 traverseAllChildrenImpl 摊平数组的问题
    // 假如 c => [[c, c]]，当执行这个函数时，返回值应该是 [c, c]
    // 然后 [c, c] 会被当成 children 传入
    // traverseAllChildrenImpl 内部逻辑判断是数组又会重新递归执行
    // 所以说即使你的函数是 c => [[[[c, c]]]]
    // 最后也会被递归摊平到 [c, c, c, c]
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, c => c);
  } else if (mappedChild != null) {
    // 不是数组且返回值不为空，判断返回值是否为有效的 Element
    // 是的话就把这个元素 clone 一遍并且替换掉 key
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(
        mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix +
          (mappedChild.key && (!child || child.key !== mappedChild.key)
            ? escapeUserProvidedKey(mappedChild.key) + '/'
            : '') +
          childKey,
      );
    }
    result.push(mappedChild);
  }
}
```

这些方法都是同样的处理逻辑，在执行过程中记录数量以及children，采用递归的形式。

### 参考

https://github.com/KieSun/Dream/issues/18

