**元数据即描述数据的数据**

### meta

一个html文件是一个数据，meta标签就是用来描述该文件的元数据

位于文档的头部，不包含任何内容，仅提供页面的说明，关键字等数据，服务于浏览器，搜索引擎和其他网络服务

标签的属性定义了与文档相关联的名称/键值对

- **http-equiv**: 把`content`属性关联到`HTTP`头部
  - `content-type`
  - `expires`
  - `refresh`
  - `set-cookie`
- **name**: 把`content`属性关联到一个名称
  - `author`
  - `description`
  - `keywords`
  - `generator`
  - `revised`
  - `others`
- **content**: 于`http-equiv`和`name`属性相关的元信息
- **charset**：声明当前文档所使用的字符编码

#### Notes

1. 必须位于`head`元素内部
2. 总是以名称/值的形式被成对传递的
3. 一个`meta`元素只用于一种用途
4. 如果设置了`name`，则说明是一个文档页面，适用于整个页面
5. 如果设置了`http-equiv`，则是一个`pragma`指令，通常由Web服务器提供有关如何提供网页的信息。
6. 如果设置了`charset`，则是字符集声明，用于网页所使用的字符编码。
7. 如果设置了`itemprop`，则是用户定义的元数据 - 对于用户代理是透明的，因为元数据的语义是特定于用户的

### name

定义元数据的名称，与`content`属性包含的值相关联。HTML 和 XHTML 标签都没有指定任何预先定义的 `<meta>` 名称。通常情况下，您可以自由使用对自己和源文档的读者来说富有意义的名称。

- `application-name`：定义正运行在该网页上的网络应用名称

  - 简单的网页不应该去定义

- `author`：文档的作者名称

- `description`：内容的简短和精确描述，一些浏览器，如Firefox和Opera，将其用作书签页面的默认描述。

- `generator`：生成页面的软件的标识符

- `keywords`：用逗号分隔的与页面内容相关的单词

- `referrer`：控制所有从该页面发出的HTTP请求中`referer`首部的内容。`content`取值：数据来源于[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#attr-name)

  | content                      | 解释                                                         |
  | ---------------------------- | ------------------------------------------------------------ |
  | `no-referrer`                | 不要发送 HTTP `Referer` 首部。                               |
  | `origin`                     | 发送当前文档的 [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)。 |
  | `no-referrer-when-downgrade` | 当目的地是先验安全的(https->https)则发送 [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) 作为 referrer ，但是当目的地是较不安全的 (https->http)时则不发送 referrer 。这个是默认的行为。 |
  | `origin-when-crossorigin`    | 在同源请求下，发送完整的URL (不含查询参数) ，其他情况下则仅发送当前文档的 [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)。 |
  | `unsafe-URL`                 | 在同源请求下，发送完整的URL (不含查询参数)。                 |

- `creator`：文档创建者的名称，可以是机构的名称，有多个的话必须定义多个`meta`

- `googlebot`：`robots`谷歌的索引抓取工具Googlebot 的同义词，只适用于google

- `publisher`：以自由格式定义文档发布者的名称，可以是机构的名称。

- `robots`：定义协作爬虫应该与页面的行为，以逗号分隔的值的列表。数据来源于[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#attr-name)

  | 值             | 描述                                                         | 使用者                                                       |
  | :------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
  | `index`        | 允许机器人索引页面                                           | 所有                                                         |
  | `noindex`      | 阻止机器人索引页面                                           | 所有                                                         |
  | `follow`       | 允许机器人跟踪页面上的链接                                   | 所有                                                         |
  | `nofollow`     | 阻止机器人跟踪页面上的链接                                   | 所有                                                         |
  | `noodp`        | 阻止使用[Open Directory Project](http://www.dmoz.org/)描述（如果有）作为搜索引擎结果页面中页面的描述 | [谷歌](http://www.google.com/support/webmasters/bin/answer.py?hl=en&answer=79812)，[雅虎](http://help.yahoo.com/l/us/yahoo/search/indexing/indexing-11.html;_ylt=Arh3LHnisvRMPJKzQqmJ97JYqCN4)，[必应](http://www.bing.com/toolbox/blogs/webmaster/archive/2008/06/03/robots-exclusion-protocol-joining-together-to-provide-better-documentation.aspx) |
  | `noarchive`    | 阻止搜索引擎缓存页面内容                                     | [谷歌](http://www.google.com/support/webmasters/bin/answer.py?hl=en&answer=79812)，[雅虎](http://help.yahoo.com/l/us/yahoo/search/indexing/basics-10.html;_ylt=Aszma_Ly8TfhL7mn_LGWn5RYqCN4) |
  | `nosnippet`    | 阻止在搜索引擎结果页面中显示页面的任何描述                   | [谷歌](http://www.google.com/support/webmasters/bin/answer.py?answer=35304) |
  | `noimageindex` | 阻止此页面显示为索引图像的引用页面                           | [谷歌](http://www.google.com/support/webmasters/bin/answer.py?hl=en&answer=79812) |
  | `noydir`       | 阻止使用Yahoo Directory描述（如果有）作为搜索引擎结果页面中页面的描述 | [雅虎](http://help.yahoo.com/l/us/yahoo/search/indexing/indexing-11.html;_ylt=Arh3LHnisvRMPJKzQqmJ97JYqCN4) |
  | `nocache`      | 同义词 `noarchive`                                           | [Bing](http://www.bing.com/toolbox/blogs/webmaster/archive/2008/06/03/robots-exclusion-protocol-joining-together-to-provide-better-documentation.aspx) |

- `slurp`：与`robots`一样， 但其仅使用于 Slurp -- Yahoo Search的抓取工具。

- `rebderer`：为双核浏览器准备，用于指定双核浏览器默认以何种方式渲染页面

- `viewport`：提供有关视口初始大小的提示，仅供移动设备使用。数据来源于[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#attr-name)

  | 值              | 可能值                               | 描述                                                         |
  | :-------------- | :----------------------------------- | :----------------------------------------------------------- |
  | `width`         | 一个正整数或者字符串 `device-width`  | 以pixels（像素）为单位， 定义viewport（视口）的宽度。        |
  | `height`        | 一个正整数或者字符串 `device-height` | 以pixels（像素）为单位， 定义viewport（视口）的高度。        |
  | `initial-scale` | `一个0.0` 到`10.0之间的正数`         | 定义设备宽度（纵向模式下的设备宽度或横向模式下的设备高度）与视口大小之间的缩放比率。 |
  | `maximum-scale` | `一个0.0` 到`10.0之间的正数`         | 定义缩放的最大值；它必须大于或等于`minimum-scale`的值，不然会导致不确定的行为发生。 |
  | `minimum-scale` | 一个`0.0` 到`10.0`之间的正数         | 定义缩放的最小值；它必须小于或等于`maximum-scale`的值，不然会导致不确定的行为发生。 |
  | `user-scalable` | 一个布尔值（`yes`或者`no`）          | 如果设置为` no`，用户将不能放大或缩小网页。默认值为` yes`。  |

#### Notes

1. 设置了`itemprop`, `http-equiv`or `charset`中任意一个属性 ，都不能在设置这个属性了。
2. 动态的插入`<meta name="referrer">`是不起作用的，如果同时有多个彼此冲突的策略被定义，那么 no-referrer 策略会生效。
3. 如果没有提供 name 属性，会采用 http-equiv 属性的值。

### charset

声明当前文档所使用的字符编码，可以被具有`lang`属性的元素所覆盖。值必须是一个符合由IANA所定义的字符编码首选MIME 名称（*preferred MIME name* ）之一。

#### Notes

1. 鼓励使用UTF-8
2. 不应该使用不兼容ASCII的编码规范， 以避免不必要的安全风险：浏览器不支持他们(这些不规范的编码)可能会导致浏览器渲染html出错. 比如`JIS_C6226-1983`, `JIS_X0212-1990`, `HZ-GB-2312`, `JOHAB`,ISO-2022 系列,EBCDIC系列 等文字 
3. 非兼容ASCII编码就是那些不会将8位代码点的`0x20` 到 `0x7E` 映射为Unicode代码点 `0x0020` 到 `0x007E` 的编码)
4. 开发者必须禁用 `CESU-8`, `UTF-7`, `BOCU-1` 或 `SCSU` 这些字符集，因为这些字符集已经被证实存在跨站脚本攻击（XSS）的风险。
5. 开发者应尽量避免使用 `UTF-32`字符集对网页进行编码，因为不是所有的HTML5编码算法能够将其与 `UTF-16` 编码区分开来。
6. 声明的字符编码必须与页面保存所使用的编码相匹配，以避免乱码和安全漏洞.
7. HTTP的Content-Type头部以及任何Byte-Order Marks元素都优先于此元素。
8. 强烈建议使用该属性定义字符编码. 如果未定义，某些跨脚本技术可能危害网页

### http-equiv

指示服务器在发送实际的文档之前先在要传送给浏览器的 MIME 文档头部包含名称/值对。

- `content-language`：定义页面使用的默认语言
  - 尽量使用全剧属性`lang`来代替
- `content-security-policy`：允许页面作者定义当前页的 [内容策略](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives)。 内容策略主要指定允许的服务器源和脚本端点，这有助于防止跨站点脚本攻击。
- `content-type`：定义文档的MIME type
  - 使用`charset`代替
- `default-style`：指定了在页面上使用的首选样式表
- `refresh`
  - 如果`content`只包含一个正整数，则是重新载入页面的时间间隔
  - 如果`content`包含一个正整数并且跟着一个字符串，则是重定向到指定链接的时间间隔
- `set-cookie`：为页面定义cookie
  - 该用HTTP的`Set-Cookie`代替

### robots.txt和meta robots区别

#### robots.txt

阻止搜索引擎抓取页面，一般不建议使用

##### 创建

在根目录创建`robots.txt`

###### 内容

User-agent：搜索引擎的值（*表示所有），比如`Baiduspider`，`Googlebot`，`MSNBot`等

Disallow：不希望抓取的页面路径

Allow：禁止抓取的路径里面存在子路径需要被抓取

##### 应用场景

- 未完成的頁面
- 测试页面
- 网站后台

#### meta robots

在索引层面阻止搜索引擎索引页面，但搜索引擎还是抓取了页面的

##### 应用场景

- 当网页不适合出现但是又可以提高SEO排名

### 参考

[meta-MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#attr-name)

[三分鐘搞懂 SEO的《meta robots、robots.txt》](http://www.yesharris.com/meta-robots-and-robots-txt/)