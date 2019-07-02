### XSS

`Cross-Site Scripting`，跨站点脚本攻击是一种注入类型,其中恶意脚本被注入到其他良性和可信赖的网站中,当攻击者使用Web应用程序将恶意代码(通常以浏览器端脚本的形式)发送给不同的最终用户时,就会触发XSS攻击。

通常发生在Web应用程序在其生成的输出中使用了来自用户的输入而无需验证或编码它的任何地方

因为脚本来自可信赖的网站，所以恶意脚本可以访问任何cookie，session tokens或与该站点一起使用的一些敏感信息，或者让恶意脚本重写HTML内容

### 条件

1. 数据通过不受信任的来源进入Web应用程序（如Web请求）
2. 数据包含在动态内容中，该动态内容在未经过验证的情况下发送给Web用户

### 分类

#### 反射型（非持久性）

指注入的脚本从服务器反射出来的攻击，例如错误消息，搜索结果或包含服务器的其他响应。攻击可以通过电子邮件或者欺骗用户点击恶意链接，提交特制的表单或者只是浏览恶意网站时

#### 存储型（持久性）

注入的脚本永久存储在目标服务器上的攻击，例如在数据库，消息论坛，访问者日志，注释字段等中

##### 流程

将恶意的XSS代码提交网站--->网站把XSS代码存储进数据库--->当页面再次被其他正常用户请求时，服务器发送已经被植入XSS代码的数据给客户端--->客户端执行XSS代码

#### 基于DOM的XSS（0型XSS）

不需要服务器的参与，客户端脚本自身解析不正确

### 防御

1. 将用户输入的内容进行转义
2. 对一些特殊字符进行转义
3. 使用自动转义模版系统
4. **CSP(Content Security Policy)**[内容安全策略MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
5. `httpOnly`
6. `X-XSS-Protection`：一般默认启用，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-XSS-Protection)

### NOTES

存储，反射，DOM三种不同类型的XSS存在重叠，在2012年中开始使用两个新术语来帮助组织可能发生的XSS类型

#### 服务器XSS

恶意数据包含在服务器生成的HTML响应中。此数据的来源可以来自请求，也可以来自存储的位置。

#### 客户端XSS

当不受信任的用户提供的数据用于使用不安全的JavaScript调用更新DOM。此数据可能来自DOM，也可能由服务器发送， 

### 参考

[主人的CheatSheetSeries / Cross_Site_Scripting_Prevention_Cheat_Sheet.md·OWASP / CheatSheetSeries](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.md)