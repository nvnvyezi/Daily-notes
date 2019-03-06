可以在git js-demo仓库中查看例子:https://github.com/nvnvyezi/js-demo/tree/master/h5-drag

**相关知识**

1. DataTransfer 对象：退拽对象用来传递的媒介，使用一般为Event.dataTransfer。
2. draggable: 是否可拖动
3. ondragstart 事件：当拖拽元素开始被拖拽的时候触发的事件，此事件作用在被拖曳元素上
4. ondragenter 事件：当拖曳元素进入目标元素的时候触发的事件，此事件作用在目标元素上
5. ondragover 事件：拖拽元素在目标元素上移动的时候触发的事件，此事件作用在目标元素上
6. ondrop 事件：被拖拽的元素在目标元素上同时鼠标放开触发的事件，此事件作用在目标元素上
7. ondragend 事件：当拖拽完成后触发的事件，此事件作用在被拖曳元素上
8. Event.preventDefault() 方法：阻止默认的些事件方法等执行。在ondragover中一定要执行preventDefault()，否则ondrop事件不会被触发。另外，如果是从其他应用软件或是文件中拖东西进来，尤其是图片的时候，默认的动作是显示这个图片或是相关信息，并不是真的执行drop。此时需要用用document的ondragover事件把它直接干掉。
9. Event.effectAllowed 属性：就是拖拽的效果。



- **在拖动目标上触发事件** (源元素):
  - ondragstart - 用户开始拖动元素时触发
  - ondrag - 元素正在拖动时触发
  - ondragend - 用户完成元素拖动后触发
- **释放目标时触发的事件**:
  - ondragenter - 当被鼠标拖动的对象进入其容器范围内时触发此事件
  - ondragover - 当某被拖动的对象在另一对象容器范围内拖动时触发此事件
  - ondragleave - 当被鼠标拖动的对象离开其容器范围内时触发此事件
  - ondrop - 在一个拖动过程中，释放鼠标键时触发此事件

一个完整的drag and drop流程通常包含以下几个步骤:

1.设置可拖拽目标.设置属性draggable="true"实现元素的可拖拽.
2.监听dragstart，通过DataTransfer设置拖拽数据
3.为拖拽操作设置反馈图标(可选)
4.设置允许的拖放效果，如copy,move,link
5.设置拖放目标，默认情况下浏览器阻止所有的拖放操作，所以需要监听dragenter或者dragover取消浏览器默认行为使元素可拖放.
6.监听drop事件执行所需操作