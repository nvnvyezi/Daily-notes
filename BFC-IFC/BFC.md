**定义**:

BFC(Block formatting context)直译为"块级格式化上下文"。它**是一个独立的渲染区域**，只有**Block-level box**参与（在下面有解释）， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

我们常说的文档流其实分为定位流、浮动流和普通流三种。而**普通流其实就是指BFC中的FC**。

**FC**是formatting context的首字母缩写，直译过来是格式化上下文，它**是页面中的一块渲染区域**，有一套渲染规则，决定了其**子元素如何布局，以及和其他元素之间的关系和作用。**

常见的FC有BFC、IFC（行级格式化上下文），还有GFC（网格布局格式化上下文）和FFC（自适应格式化上下文），这里就不再展开了。

**生成条件**

1. 根元素或其它包含它的元素
2. 浮动 (元素的 float 不为 none)
3. 绝对定位元素 (元素的 position 为 absolute 或 fixed)
4. 行内块 inline-blocks (元素的 display: inline-block)
5. 表格单元格 (元素的 display: table-cell，HTML表格单元格默认属性)
6. 表格标题 (元素的 display: table-caption, HTML表格标题默认属性)
7. overflow 的值不为 visible的元素
8. 弹性盒子 flex boxes (元素的 display: flex 或 inline-flex)

**布局规则**

1. 内部的Box会在垂直方向，一个接一个地放置。
2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
3. 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
4. BFC的区域不会与float box重叠。
5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
6. 计算BFC的高度时，浮动元素也参与计算

**应用**

1. 自适应两栏布局
2. 可以阻止元素被浮动元素覆盖
3. 可以包含浮动元素-清除内部浮动
4. 分属于不同的BFC时可以阻止margin重叠

