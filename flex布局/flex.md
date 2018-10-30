###弹性布局

分为两种,快flex,行内flex

采用flex布局的元素称为flex容器,其子元素自动成为flex item （项目）

子元素 float+vertical-align+clear 失效

两根轴,水平的主轴,垂直的交叉轴



####flex容器属性

flex-direction:  决定主轴的方向

- column: 主轴垂直，起点在上方,

- column-reverse: 起点在下方
- row:  默认值:
- row-reverse: 起点在右边

flex-wrap: 换行

- nowrap: 默认值
- wrap: 换行
- wrap-reverse: 换行，第一行在下方

flex-flow: 上面两个简写

justify-content: 主轴排列

- flex-start: 
- flex-end:
- center
- space-around
- space-between

align-items: 交叉轴排列

- flex-start
- flex-end
- center
- stretch
- baseline

align-content: 　多根轴线的对齐方式



####flex item 属性

order: 顺序，数值越小越靠前

flex-grow:  是否在有剩余空间时放大比例，默认值0

flex-shrink: 　是否缩小，默认值１

flex-basis:  项目占据主轴空间

flex: 上面三个的缩写

align-self: 单个项目对齐方式