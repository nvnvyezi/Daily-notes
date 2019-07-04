### 相同点

- 使用Virtual DOM
- 提供了响应式和组件化的视图组件
- 将注意力集中保持在核心库，而将其他功能如路由，状态管理等分离出单独的库

### 不同点

- React应用中，某个组件的状态发生变化，会重新渲染整个组件，或者手动使用`shouldComponentUpdate`来决定根据props选择是否渲染。Vue中组件的依赖是在渲染过程中自动追踪的，相当于自动使用`shouldComponentUpdate`，优点更加专注于应用本身，缺点不可控
- 状态管理 vs 对象属性
  - React：单向数据流，state管理组件状态，通过setState来更改
  - Vue：双向数据流，data属性管理组件状态
- HTML & CSS
  - React崇尚一切都是javaScript，可以将HTML和CSS都以JavaScript的形式来表达，设置CSS使用`className`字段，一般采用外部引入css文件
  - Vue偏向于在经典的Web技术上进行拓展，设置CSS使用style标签，使用scoped属性将CSS作用域限制在同一个文件，具体表现方式为自动添加一个类似`data-v-1234`的唯一属性
- JSX vs Templates
  - JSX使得可以使用JavaScript来构建页面，比如可以使用js变量，js自带的流程控制。开发工具对JSX支持度比较好
  - 模版语法偏向于原声，好上手，学习成本低，旧项目迁移到Vue更容易。
  - 偏视图表现使用模版，偏逻辑表现使用JSX

### 参考

[Vue](https://cn.vuejs.org/v2/guide/comparison.html)