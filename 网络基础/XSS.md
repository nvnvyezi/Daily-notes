[原文地址1](https://segmentfault.com/a/1190000013315450)

#### 分类

**反射型： **又称为非持久性跨站点脚本攻击，产生的原因是攻击者注入的数据反应在响应中。其要求用户访问一个被篡改后的连接，被植入的脚本被用户浏览器执行。

- 非持久化
- 必须用户点击链接

**存储型： **又称为持久性跨站点脚本攻击，一般指XSS攻击代码被存进数据库中，在用户每次放问的时候都会执行。

- 坏人把恶意的XSS代码提交网站--->网站把XSS代码存储进数据库--->当页面再次被其他正常用户请求时，服务器发送已经被植入XSS代码的数据给客户端--->客户端执行XSS代码

**基于DOM的XSS： **客户端脚本自身解析不正确



#### 防御

1. 将用户输入的内容进行转义

2. 对一些特殊字符进行转义

3. **CSP(Content Security Policy)**内容安全策略（Content Security Policy，简称CSP）是一种以可信白名单作机制，来限制网站中是否可以包含某来源内容。默认配置下不允许执行内联代码（<script>块内容，内联事件，内联样式），以及禁止执行eval() , newFunction() , setTimeout([string], ...) 和setInterval([string], ...) 。

   1. 只允许本站资源`Content-Security-Policy： default-src ‘self’`

   2. 允许本站的资源以及任意位置的图片以及 [https://segmentfault.com](https://segmentfault.com/) 下的脚本。

      ```js
      Content-Security-Policy： default-src ‘self’; img-src *;
      script-src https://segmentfault.com
      ```

4. `httpOnly`

