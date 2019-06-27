### CSRF(跨站点请求伪造)

`(Cross—Site Request Forgery)`

通过社交工程（比如电子邮件/聊天发送链接）的帮助，在用户当前经过身份验证的Web应用程序上，欺骗Web应用程序的用户强制执行攻击者所想要执行的操作（如发邮件，盗取信息，转账，购买商品等）

成功的CSRF漏洞攻击可以在针对普通用户时最终损害用户数据和操作。如果受害者是管理账户则可能会危及整个web程序。

### 流程

1. 利用URL或脚本构建漏洞
2. 欺骗用户用社会工程执行行动

用户正常登录受信任网站A，并在本地生成A网站的一些身份认证信息。随后在没登出A的情况下，访问危险网站B。

### 例子

#### get场景

假如一家银行用以运行转账操作的URL地址如下：

```http
http://www.bank.com/transform?account=AccoutName&amount=1000&for=PayeeName
```

攻击的方式可以通过

- 发送带有HTML内容的未经请求的电子邮件
- 在受害者正在进行网上银行业务时可能会访问的网页上植入漏洞利用网址或脚本

```html
<!-- 例子 -->
<img src="http://www.bank.com/transform?account=Alice&amount=1000&for=Badman" width="0" height="0">
<a href="http://www.bank.com/transform?account=Alice&amount=1000&for=Badman">点击有惊喜</a>
```

如果有账户名为Alice的用户访问了恶意站点，而她之前刚访问过银行不久，登录信息尚未过期，那么她就会损失1000资金。

#### post场景

和GET的区别是受害者如何执行攻击

post请求请求主体在body中，不能像get直接拼在参数中，攻击时可以使用FORM标记进行传递

```html
<form action =“http://bank.com/transfer.do” method =“POST”>
<input type =“hidden”name =“param1”value =“PARAM1”/>
<input type =“hidden”name =“param2”value =“PARAM2”/>
<input type =“submit”value =“查看我的图片”/>
</form>
```

触发此表单可以是用户手动点击提交按钮，或者使用js来执行

```html
<body onload =“document.forms[0].submit（）”>
```

#### 其他HTTP方法

可以使用AJAX来模拟请求，但是会受到同源策略的限制，除非CORS所允许的网站来源为*

```http
Access-Control-Allow-Origin：*
```

#### 条件

- 浏览器自动发送用于识别用户会话的信息，假设用户刚刚对站点进行了身份验证，攻击者欺骗用户误点发送请求后，cookie随之自动发送
- 用户登录了一个网站后，在不关闭的情况下打开另一个tab页面并访问另外的网站。
- 关闭浏览器后，有些网站本地的Cookie不能立刻过期，即上次的会话已经结束。（事实上，关闭浏览器不能结束一个会话，但大多数人都会错误的认为关闭浏览器就等于退出登录/结束会话了）
- 上图中所谓的攻击网站，可能是一个存在其他漏洞的可信任的经常被人访问的网站。

### 防御

#### `Referer`

HTTP头中的Referer字段标明了该 HTTP 请求的来源地址。在通常情况下，访问一个安全受限页面的请求来自于同一个网站，而如果黑客要对其实施 CSRF 攻击，他一般只能在他自己的网站构造请求。因此，可以通过验证Referer值来防御CSRF 攻击。

#### 使用验证码

关键操作页面加上验证码，后台收到请求后通过判断验证码可以防御CSRF。但这种方法对用户不太友好。

#### 添加token验证

CSRF 攻击之所以能够成功，是因为用户所有验证信息都是存在于cookie中，攻击者可以完全伪造用户的请求。要抵御 CSRF，关键在于在请求中放入黑客所不能伪造的信息，并且该信息不存在于 cookie 之中。这种数据通常是窗体中的一个数据项。服务器将其生成并附加在窗体中，其内容是一个伪随机数。当客户端通过窗体提交请求时，这个伪随机数也一并提交上去以供校验。正常的访问时，客户端浏览器能够正确得到并传回这个伪随机数，而通过CSRF传来的欺骗性攻击中，攻击者无从事先得知这个伪随机数的值，服务端就会因为校验token的值为空或者错误，拒绝这个可疑请求。

#### header中自定义属性

#### 向URL和所有表单添加每次请求的随机数（表单键）

许多框架已经开始内置此保护，因此不在需要特意编写此保护代码

#### 向所有表单添加哈希（会话ID， 函数名称，服务器端密钥）

#### 用户在访问另一个网页时注销当前网站的身份信息

#### samesite Cookie

### 参考

[跨站请求伪造（CSRF） -  OWASP](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF))