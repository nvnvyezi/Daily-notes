###### body-parser是什么?

body-parser是一个HTTP`请求体解析中间件`，使用这个模块可以解析JSON、Raw、文本、URL-encoded格式的请求体，Express框架中就是使用这个模块做为请求体解析中间件。

###### body-parser 与 原生解析对比

Node.js 原生HTTP模块中，是将用户请求数据封装到了用于请求对象req中，该对象是一个`IncomingMessage`，该对象同时也是一个可读流对象。

```
var http = require('http');
//用http模块创建一个http服务端 
http.createServer(function(req, res) {
req.on('data', function(chunk){
....
});
req.on('end', function(){
....
//在此对不同类型进行判断
}).listen(3000);;
```

body-parser模块是一个Express中间件，它使用非常简单且功能强大，接下来进入干货阶段.

### 第二部分 body-parser

2.1 下载配置

```
$ npm install body-parser
```

2.2 基本使用

```
var express = require('express')
//获取模块
var bodyParser = require('body-parser')

var app = express()

// 创建 application/json 解析
var jsonParser = bodyParser.json()

// 创建 application/x-www-form-urlencoded 解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// POST /login 获取 URL编码的请求体
app.post('/login', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.send('welcome, ' + req.body.username)
})

// POST /api/users 获取 JSON 编码的请求体
app.post('/api/users', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  // create user in req.body
});
app.listen(3000);
```

**2.3 API**

对请求体的四种解析方式:

```
1. bodyParser.json(options): 解析json数据
2. bodyParser.raw(options): 解析二进制格式(Buffer流数据)
3. bodyParser.text(options): 解析文本数据
4. bodyParser.urlencoded(options): 解析UTF-8的编码的数据。
```

2.3.1 bodyParser 解析json数据

```
var bodyParser = require('body-parser')
```

bodyParser变量是对中间件的引用。请求体解析后，解析值都会被放到req.body属性，内容为空时是一个{}空对象。

2.3.2 bodyParser.json(options) :返回一个仅解析json格式数据的中间件。

option可选对象:

```
1. inflate - 设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默认为true。
2. limit - 设置请求的最大数据量。默认为'100kb'
3. reviver - 传递给JSON.parse()方法的第二个参数，详见JSON.parse()
4. strict - 设置为true时，仅会解析Array和Object两种格式；设置为false会解析所有JSON.parse支持的格式。默认为true
5. type - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用type-is来查找MIMI类型；当为函数是，中间件会通过fn(req)来获取实际值。默认为application/json。
6. verify - 这个选项仅在verify(req, res, buf, encoding)时受支持
```

2.3.3 bodyParser.raw(options)

返回一个将所有数据做为`Buffer格式`处理的中间件.其后的所有的req.body中将会是一个Buffer值。

option可选值:

```
1. inflate - 设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默认为true。
2. limit - 设置请求的最大数据量。默认为'100kb'
3. type - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用type-is来查找MIMI类型；当为函数是，中间件会通过fn(req)来获取实际值。默认为application/octet-stream。
4. verify - 这个选项仅在verify(req, res, buf, encoding)时受支持
```

2.3.4 bodyParser.text(options) 解析文本格式

返回一个仅处理字符串格式处理的中间件。其后的所有的req.body中将会是一个字符串值。

```
1. defaultCharset - 如果Content-Type后没有指定编码时，使用此编码。默认为'utf-8'
2. inflate - 设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默认为true。
3. limit - 设置请求的最大数据量。默认为'100kb'
4. type - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用type-is来查找MIMI类型；当为函数是，中间件会通过fn(req)来获取实际值。默认为application/octet-stream。
5. verify - 这个选项仅在verify(req, res, buf, encoding)时受支持
```

2.3. 5 bodyParser.urlencoded(options) 解析UTF-8的编码的数据。
 返回一个处理urlencoded数据的中间件。

option可选值

```
1. extended - 当设置为false时，会使用querystring库解析URL编码的数据；当设置为true时，会使用qs库解析URL编码的数据。后没有指定编码时，使用此编码。默认为true
2. inflate - 设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默认为true。
3. limit - 设置请求的最大数据量。默认为'100kb'
4. parameterLimit - 用于设置URL编码值的最大数据。默认为1000
5. type - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用type-is来查找MIMI类型；当为函数是，中间件会通过fn(req)来获取实际值。默认为application/octet-stream。
6. verify - 这个选项仅在verify(req, res, buf, encoding)时受支持
```

代码示例:

```
var express = require('express')
var bodyParser = require('body-parser')
var app = express()

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// POST /home 获取 urlencoded bodies
app.post('/home', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.send('welcome, ' + req.body.username)
})

// POST /api/users 获取 JSON bodies
app.post('/about', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.send('welcome ****, ' + req.body.username)
});

app.listen(3000);
```

![img](//upload-images.jianshu.io/upload_images/326255-d03bc0d461ade3a3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/700)

屏幕快照 2016-11-17 下午6.06.21.png

![img](//upload-images.jianshu.io/upload_images/326255-6da516cef7775bd9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/700)

屏幕快照 2016-11-17 下午6.07.03.png

### 第三部分 POST相关内容

HTTP 协议是以 ASCII 码传输，建立在 TCP/IP 协议之上的`应用层规范`。规范把 HTTP 请求分为三个部分：`状态行`、`请求头`、`消息主体`。HTTP/1.1 协议规定的 HTTP 请求方法有 OPTIONS、GET、HEAD、POST、PUT、DELETE、TRACE、CONNECT 这几种。

**协议规定 POST 提交的数据必须放在消息主体（entity-body）中，但协议并没有规定数据必须使用什么编码方式。**
 POST 提交数据时，包含了 `Content-Type` 和`消息主体编码方式`两部分。因为服务器端通常会依据`Content-Type`来决定使用何种方式解析主体部分.

四种方式:

```
1. application/x-www-form-urlencoded:提交的数据按照 key1=val1&key2=val2 的方式进行编码，key 和 val 都进行了 URL 转码。
2. multipart/form-data:使用表单上传文件时，必须让 <form> 表单的 enctype 等于 multipart/form-data
3. application/json: 用来告诉服务端消息主体是序列化后的 JSON 字符串。
4. text/xml: 它是一种使用 HTTP 作为传输协议，XML 作为编码方式的远程调用规范。
```

其中application/x-www-form-urlencoded编码其实是基于uri的percent-encoding编码的，所以采用application/x-www-form-urlencoded的POST数据和queryString只是形式不同，本质都是传递参数。