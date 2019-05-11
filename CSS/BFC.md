### Block Formating Context

快级格式化上下文是Web页面的可视化css渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域

快级格式化上下文包含创建它的元素内部的所有内容

浮动

是一个独立的渲染区域，只有`Block-level Box`参与， 它规定了内部的`Block-level Box`如何布局，并且与这个区域外部毫不相干。

### 生成条件

1. 根元素或包含根元素的元素
2. 浮动 (元素的 `float` 不为 `none`)
3. 绝对定位元素 (元素的 `position` 为 `absolute` 或 `fixed`)
4. 行内块 inline-blocks (元素的 `display`: `inline-block`)
5. 表格单元格 (元素的 `display`: `table-cell`，HTML表格单元格默认属性)
6. 表格标题 (元素的 `display`: `table-caption`, HTML表格标题默认属性)
7. 匿名表格单元格元素（元素的 [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display)为 `table、`table-row`、 `table-row-group、``table-header-group、``table-footer-group`（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 `inline-table`）
8. `overflow` 的值不为 `visible` 的元素
9. `display` 的值为 `float-root`的元素
10. 弹性元素（[`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display)为 `flex` 或 `inline-flex`元素的直接子元素）
11. 网格元素（[`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display)为 `grid` 或 `inline-grid` 元素的直接子元素）
12. 多列容器（元素的 [`column-count`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-count) 或 [`column-width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-width) 不为 `auto，包括 `column-count` 为 `1`）

### 布局规则

1. 内部的Box会在垂直方向，一个接一个地放置。
2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
3. 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
4. BFC的区域不会与float box重叠。
5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
6. 计算BFC的高度时，浮动元素也参与计算

**应用**

1. 自适应两栏布局
2. 可以阻止元素被浮动元素覆盖，清除浮动
4. 分属于不同的BFC时可以阻止margin重叠
4. 解决父元素高度塌陷

### 外边距合并

块的顶部和底部边距有时被折叠成单个边距，其大小是单个边距中的最大边，（浮动和绝对定位的元素永远不会折叠）

#### 触发

1. 相邻的兄弟姐妹
2. 父母和第一个孩子或者最后一个孩子
   1. 没有border，padding，inline部分，块格式化上下文创建或者clear将父母和第一个孩子隔开
   2. 没有border，padding，inline content，height，min-height，max-height将父母和最后一个孩子分开
3. 空块
   1. 没有border，padding，inline content，height，min-height将margin-top和margin-bottom隔开

#### todo

- 当组合上述情况时，会发生更复杂的边缘折叠（超过两个边距）
- 当涉及负边距时，折叠边际的大小是最大正边距和最小（最负）负边距之和。
- 当所有边距为负时，折叠边距的大小是最小（最负）边距。这适用于相邻元素和嵌套元素。



