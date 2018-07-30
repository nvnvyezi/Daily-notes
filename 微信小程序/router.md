## (1)wx.navigateTo(OBJECT)

保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。

OBJECT 参数说明：

| 参数     | 类型     | 必填 | 说明                                                         |
| -------- | -------- | ---- | ------------------------------------------------------------ |
| url      | String   | 是   | 需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 ‘path?key=value&key2=value2’ |
| success  | Function | 否   | 接口调用成功的回调函数                                       |
| fail     | Function | 否   | 接口调用失败的回调函数                                       |
| complete | Function | 否   | 接口调用结束的回调函数（调用成功、失败都会执行）             |

示例代码：

```
wx.navigateTo({
  url: 'test?id=1'//实际路径要写全
})123
```

```
//test.js
Page({
  onLoad: function(option){
    console.log(option.query)  
  }
})123456
```

> 注意：为了不让用户在使用小程序时造成困扰，我们规定页面路径只能是五层，请尽量避免多层级的交互方式。

## （2）wx.redirectTo(OBJECT)

关闭当前页面，跳转到应用内的某个页面。 
OBJECT 参数说明：

| 参数     | 类型     | 必填 | 说明                                                         |
| -------- | -------- | ---- | ------------------------------------------------------------ |
| url      | String   | 是   | 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 ‘path?key=value&key2=value2’ |
| success  | Function | 否   | 接口调用成功的回调函数                                       |
| fail     | Function | 否   | 接口调用失败的回调函数                                       |
| complete | Function | 否   | 接口调用结束的回调函数（调用成功、失败都会执行）             |

示例代码：

```
wx.redirectTo({
  url: 'test?id=1'
})123
```

## （3）wx.switchTab(OBJECT)

跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面

OBJECT 参数说明：

| 参数     | 类型     | 必填 | 说明                                                         |
| -------- | -------- | ---- | ------------------------------------------------------------ |
| url      | String   | 是   | 需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数 |
| success  | Function | 否   | 接口调用成功的回调函数                                       |
| fail     | Function | 否   | 接口调用失败的回调函数                                       |
| complete | Function | 否   | 接口调用结束的回调函数（调用成功、失败都会执行）             |

示例代码：

```
{
  "tabBar": {
    "list": [{
      "pagePath": "index",
      "text": "首页"
    },{
      "pagePath": "other",
      "text": "其他"
    }]
  }
}1234567891011
```

```
wx.switchTab({
  url: '/index'
})123
```

## （4）wx.navigateBack(OBJECT)

关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。

OBJECT 参数说明：

| 参数  | 类型   | 必填 | 说明                                                    |
| ----- | ------ | ---- | ------------------------------------------------------- |
| delta | Number | 1    | 返回的页面数，如果 delta 大于现有页面数，则返回到首页。 |

示例代码：

```
// 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，而 redirectTo 方法则不会。见下方示例代码

// 此处是A页面
wx.navigateTo({
  url: 'B?id=1'
})123456
```

```
// 此处是B页面
wx.navigateTo({
  url: 'C?id=1'
})1234
```

```
// 在C页面内 navigateBack，将返回A页面
wx.navigateBack({
  delta: 2
})1234
```

## （5）使用`<navigator/>`标签实现页面跳转

navigator

页面链接。

| 参数             | 类型    | 必填            | 说明                                                         |
| ---------------- | ------- | --------------- | ------------------------------------------------------------ |
| url              | String  |                 | 应用内的跳转链接                                             |
| redirect         | Boolean | false           | 打开方式为页面重定向，对应 wx.redirectTo（将被废弃，推荐使用 open-type） |
| open-type        | String  | navigate        | 可选值 ‘navigate’、’redirect’、’switchTab’，对应于wx.navigateTo、wx.redirectTo、wx.switchTab的功能 |
| hover-class      | String  | navigator-hover | 指定点击时的样式类，当hover-class=”none”时，没有点击态效果   |
| hover-start-time | Number  | 50              | 按住后多久出现点击态，单位毫秒                               |
| hover-stay-time  | Number  | 600             | 手指松开后点击态保留时间，单位毫秒                           |

示例代码：

```
<navigator url="navigate?title=navigate" hover-class="navigator-hover">跳转到新页面</navigator>
  <navigator url="redirect?title=redirect" open-type="redirect" hover-class="other-navigator-hover">在当前页打开</navigator>
  <navigator url="index" open-type="switchTab" hover-class="other-navigator-hover">切换 Tab</navigator>123
```

# 3.页面的路由和生命周期

## （1）页面的路由

在小程序中所有页面的路由全部由框架进行管理，对于路由的触发方式以及页面生命周期函数如下：

| 路由方式   | 触发时机                                        | 路由后页面         | 路由前页面                                             |
| ---------- | ----------------------------------------------- | ------------------ | ------------------------------------------------------ |
| 初始化     | 小程序打开的第一个页面                          | onLoad，onShow     |                                                        |
| 打开新页面 | 调用 API wx.navigateTo 或使用组件               | onLoad，onShow     | onHide                                                 |
| 页面重定向 | 调用 API wx.redirectTo 或使用组件               | onLoad，onShow     | onUnload                                               |
| 页面返回   | 调用 API wx.navigateBack 或用户按左上角返回按钮 | onShow             | onUnload（多层页面返回每个页面都会按顺序触发onUnload） |
| Tab 切换   | 调用 API wx.switchTab 或使用组件 或用户切换 Tab | 各种情况请参考下表 |                                                        |

Tab 切换对应的生命周期（以 A、B 页面为 Tabbar 页面，C 是从 A 页面打开的页面，D 页面是从 C 页面打开的页面为例）：

| 当前页面        | 路由后页面    | 触发的生命周期（按顺序）                           |
| --------------- | ------------- | -------------------------------------------------- |
| A               | A             | Nothing happend                                    |
| A               | B             | A.onHide(), B.onLoad(), B.onShow()                 |
| A               | B（再次打开） | A.onHide(), B.onShow()                             |
| C               | A             | C.onUnload(), A.onShow(）                          |
| C               | B             | C.onUnload(), B.onLoad(), B.onShow()               |
| D               | B             | D.onUnload(), C.onUnload(), B.onLoad(), B.onShow() |
| D（从分享进入） | A             | D.onUnload(), A.onLoad(), A.onShow()               |
| D（从分享进入） | B             | D.onUnload(), B.onLoad(), B.onShow()               |

# 4.参数传递

## （1）通过路径传递参数

通过路径传递参数在`wx.navigateTo(OBJECT)`、`wx.redirectTo(OBJECT)`和`<navigator/>`中使用方法相同 
示例代码：以`wx.navigateTo`为代表

```
​```
wx.navigateTo({
  url: 'test?id=1'//实际路径要写全
})1234
//test.js
Page({
  onLoad: function(option){
    console.log(option.id)  
  }
})123456
```

参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔； 
`test?id=1` 中id为参数键，1 为参数值 
在目的页面中onLoad（）方法中`option`对象即为参数对象，可以通过参数键来取出参数值