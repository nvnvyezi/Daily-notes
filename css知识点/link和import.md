link: 为当前页服务

属于XHTML标签

除了可以加载CSS,还可以定义RSS,定义rel连接属性

当一个页面被加载,link引用的CSS会同时被加载,

使用javaScript控制dom样式,只能使用link标签

@import: 为css服务

属于CSS范畴,只能加载CSS

等到页面全部被下载完在被加载.(有时出现闪烁)

兼容性问题





FOUC( Flash Of Unstyled Content)文档样式闪烁

**是什么**

IE在加载网页的时候,出现短暂的

 页面加载解析时，页面以样式A渲染；当页面加载解析完成后，页面突然以样式B渲染，导致出现页面样式闪烁。
 样式A，浏览器默认样式 或 浏览器默认样式 层叠 部分已加载的页面样式；
 样式B，浏览器默认样式 叠加 全部页面样式。

**为什么出现**

```
此方式由于IE会先加载整个HTML文档的DOM，然后再去导入外部的CSS文件，因此，在页面DOM加载完成到CSS导入完成中间会有一段时间页面上的内容是没有样式的，这段时间的长短跟网速，电脑速度都有关系。
```

1. 边下载边解析就是边下载html边构建DOM Tree;

2. 浏览器以user agent stylesheet(浏览器内置样式)为原料构建CSSOM Tree;

3. DOM Tree+CSSOM Tree构建出Render Tree，然后页面内容渲染出来;

4. 当解析到inline stylesheet 或 internal stylesheet时，马上刷新CSSOM Tree，CSSOM Tree或DOM Tree发生变化时会引起Render Tree变化;

5. 当解析到external stylesheet时就先加载，然后如internal stylesheet那样解析和刷新CSSOM Tree和Render Tree了。
    上述步骤5中由于样式文件存在下载这个延时不确定的阶段，因此网络环境不好或样式资源体积大的情况下我们可以看到样式闪烁明显。
    这就是为什么我们将external stylesheet的引入放在`head`标签中的原因，在`body`渲染前先把相对完整的CSSOM Tree构建好。但大家都听说过`script`会阻塞html页面解析(block parsing)，而`link`不会，那假如网络环境不好或样式资源体积大时，`body`已经解析并加入到DOM Tree后，external stylesheet才加载完成，不是也会造成FOUC吗？

    `style`,`link`等样式资源的下载、解析确实不会阻塞页面的解析，但它们会阻塞页面的渲染(block rendering)。

**什么时候出现**

1. IE浏览器
2. IE的临时文件夹没有缓存过页面的CSS文件
3. head标签里面没有任何link和script标签
4. 页面引用方式采用@import

**建议**

- css使用link标签将样式表放在顶部,防止白屏问题出现
- script标签尽量放在body闭合标签之前

