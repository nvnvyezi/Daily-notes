### link

元素规定了外部资源与当前文档的关系。这个元素最常于链接[样式表](https://developer.mozilla.org/zh-CN/docs/Glossary/CSS)，还能被用来创建站点图标(比如PC端的“favicon”图标和移动设备上用以显示在主屏幕的图标)甚至一些其他事情。

### @import

**@import** [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)[@规则](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule)，用于从其他样式表导入样式规则。这些规则必须先于所有其他类型的规则，[`@charset`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@charset) 规则除外; 因为它不是一个[嵌套语句](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Syntax#nested_statements)，@import不能在[条件组的规则](https://developer.mozilla.org/zh-CN/docs/Web/CSS/At-rule#Conditional_Group_Rules)中使用。

### 区别

- 从属关系
  - `@import`是CSS提供的语法规则，只有导入样式表的作用
  - `link`是HTML提供的标签，不仅仅用来加载CSS

- 兼容性
  - `@import`是CSS2.1引入的

- DOM控制
  - 只能通过插入`link`的形式

### FOUC

[参考](http://xbhong.top/2018/04/14/FOUC/)

