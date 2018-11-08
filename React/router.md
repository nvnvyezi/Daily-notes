[参考一](https://codeburst.io/react-router-v4-unofficial-migration-guide-5a370b8905a)

路由配置

```js
React.render((
  <Router>
    <Route path="/" component={App}>
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox}>
        <Route path="messages/:id" component={Message} />
      </Route>
    </Route>
  </Router>
), document.body)
```

通过上面的配置，这个应用知道如何渲染下面四个 URL：

| URL                   | 组件                      |
| --------------------- | ------------------------- |
| `/`                   | `App`                     |
| `/about`              | `App -> About`            |
| `/inbox`              | `App -> Inbox`            |
| `/inbox/messages/:id` | `App -> Inbox -> Message` |



on方法更改为生命周期

没有上面的嵌套写法　　替换为switch绝对路径

路由路径匹配

- `:paramName` – 匹配一段位于 `/`、`?` 或 `#` 之后的 URL。 命中的部分将被作为一个[参数](https://react-guide.github.io/react-router-cn/docs/guides/basics/docs/Glossary.md#params)
- `()` – 在它内部的内容被认为是可选的
- `*` – 匹配任意字符（非贪婪的）直到命中下一个字符或者整个 URL 的末尾，并创建一个 `splat` [参数](https://react-guide.github.io/react-router-cn/docs/guides/basics/docs/Glossary.md#params)

```js
<Route path="/hello/:name">         // 匹配 /hello/michael 和 /hello/ryan
<Route path="/hello(/:name)">       // 匹配 /hello, /hello/michael 和 /hello/ryan
<Route path="/files/*.*">           // 匹配 /files/hello.jpg 和 /files/path/to/hello.jpg
```

# Histories

### `browserHistory`

Browser history 是使用 React Router 的应用推荐的 history。它使用浏览器中的 [History](https://developer.mozilla.org/en-US/docs/Web/API/History) API 用于处理 URL，创建一个像`example.com/some/path`这样真实的 URL 。

服务器进行配置

### `hashHistory`

Hash history 使用 URL 中的 hash（`#`）部分去创建形如 `example.com/#/some/path` 的路由。

#### 像这样 `?_k=ckuvup` 没用的在 URL 中是什么？

当一个 history 通过应用程序的 `push` 或 `replace` 跳转时，它可以在新的 location 中存储 “location state” 而不显示在 URL 中，这就像是在一个 HTML 中 post 的表单数据。

在 DOM API 中，这些 hash history 通过 `window.location.hash = newHash` 很简单地被用于跳转，且不用存储它们的location state。但我们想全部的 history 都能够使用location state，因此我们要为每一个 location 创建一个唯一的 key，并把它们的状态存储在 session storage 中。当访客点击“后退”和“前进”时，我们就会有一个机制去恢复这些 location state。

### `createMemoryHistory`

Memory history 不会在地址栏被操作或读取。这就解释了我们是如何实现服务器渲染的。同时它也非常适合测试和其他的渲染环境（像 React Native ）。

和另外两种history的一点不同是你必须创建它，这种方式便于测试。





没有集中路由配置，每个人都会`history`为你创建一个对象。在`<BrowserRouter>`创建了一个浏览器历史记录中，`<HashRouter>`创建一个哈希的历史，以及`<MemoryRouter>`创建一个存储的历史。在基于路线呈现内容所需的任何位置，您只需渲染一个`<Route>`组件。

```js
<BrowserRouter>
  <div>
    <Route path='/about' component={About} />
    <Route path='/contact' component={Contact} />
  </div>
</BrowserRouter>
```



route改为组件，在何处呈现`<Route>`组件，都将呈现内容。当`<Route>`的`path`当前位置相匹配，它将使用它的渲染道具（`component`，`render`，或`children`）来呈现。如果`<Route>`'s `path`不匹配，它将呈现`null`。

获取ｐａｒａｍｓ　改为　ｍａｔｃｈ．ｐａｒａｍｓ

**解析查询字符串**

`location.query`在v4中不再存在，并且根本不解析查询字符串。您必须`location.search`使用第三方库（如`query-string`）手动解析。