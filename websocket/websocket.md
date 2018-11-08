[参考一](https://www.zhihu.com/question/20215561)

[参考二](https://juejin.im/entry/5a5c559c518825734859ee5e)

[参考三](https://juejin.im/post/5af5693451882530646527d1)

**WebSocket**是一种在单个TCP连接上进行全双工通讯的协议。 

ok，既然是双向通信，我相信你们一定玩过轮询，好吧，没玩过的看下面：

**轮询（polling）：客户端按规定时间定时像服务端发送ajax请求，服务器接到请求后马上返回响应信息并关闭连接。**

那聪明的人就想到了我可以用定时器来固定时间向服务器获取数据，

好的，这就是短轮询

**场景再现**

> 客户端：啦啦啦，有没有新信息(Request)
> 服务端：没有（Response）
> 客户端：啦啦啦，有没有新信息(Request)
> 服务端：没有。。（Response）
> 客户端：啦啦啦，有没有新信息(Request)
> 服务端：你好烦啊，没有啊。。（Response）
> 客户端：啦啦啦，有没有新消息（Request）
> 服务端：好啦好啦，有啦给你。（Response）
> 客户端：啦啦啦，有没有新消息（Request）
> 服务端：。。。。。没。。。。没。。。没有（Response） ---- loop



再说长轮询之前，先了解一下长连接（如果感兴趣，请关注，后续会详细讲长连接）

我们先模拟一下长连接的情况，client向server发起连接，server接受client连接，双方建立连接。Client与server完成一次读写之后，它们之间的连接并不会主动关闭，后续的读写操作会继续使用这个连接。



连接->传输数据->保持连接 -> 传输数据-> 。。。 ->关闭连接。 

长连接指建立SOCKET连接后不管是否使用都保持连接，但安全性较差。 



当一个TCP通道一直保持着连接状态，即称这个连接为长连接

而长轮询就是长连接的一种，实现为客户端向服务器发送Ajax请求，服务器接到请求后hold住连接，直到有新消息才返回响应信息并关闭连接，客户端处理完响应信息后再向服务器发送新的请求。

**场景再现**

> 客户端：啦啦啦，有没有新信息，没有的话就等有了才返回给我吧（Request） 服务端：额。。 等待到有消息的时候。。来 给你（Response） 客户端：啦啦啦，有没有新信息，没有的话就等有了才返回给我吧（Request） -loop

我相信你们现在应该有一个概念

那在看看他们之间的异同

**1）相同点：**当server 的数据不可达时，基于http长轮询和短轮询 的http请求，都会 停留一段时间；

**2）不同点：**http长轮询是在服务器端的停留，而http 短轮询是在 浏览器端的停留；ajax轮询 需要服务器有很快的处理速度和资源。（速度） long poll 需要有很高的并发，也就是说同时接待客户的能力。（场地大小）

**3）性能总结：**从这里可以看出，不管是长轮询还是短轮询，都不太适用于客户端数量太多的情况，因为每个服务器所能承载的TCP连接数是有上限的，这种轮询很容易把连接数顶满；

好的，其实最重要的一点就是，他们两个都是被动的，即如果服务端有消息不能直接推给客户端，得等到客户端主动来要。

而为了解决这个问题，我们的主角websocket就登场了

### **websocket**

WebSocket一种在单个 TCP 连接上进行全双工通讯的协议。WebSocket通信协议于2011年被IETF定为标准RFC 6455，并被RFC7936所补充规范，WebSocketAPI被W3C定为标准。  WebSocket 是独立的、创建在 TCP 上的协议，和 HTTP 的唯一关联是使用 HTTP 协议的101状态码进行协议切换，使用的 TCP 端口是80，可以用于绕过大多数防火墙的限制。  WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端直接向客户端推送数据而不需要客户端进行请求，在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并允许数据进行双向传送。  目前常见的浏览器如 Chrome、IE、Firefox、Safari、Opera 等都支持 WebSocket，同时需要服务端程序支持 WebSocket

### **优点**

首先，Websocket是一个**持久化**的协议，相对于HTTP这种**非持久**的协议来说。
简单的举个例子吧，用目前应用比较广泛的PHP生命周期来解释。
1) HTTP的生命周期通过Request来界定，也就是一个Request 一个Response，那么**在**HTTP1.0**中**，这次HTTP请求就结束了。
在HTTP1.1中进行了改进，使得有一个keep-alive，也就是说，在一个HTTP连接中，可以发送多个Request，接收多个Response。
但是请记住 Request = Response ， 在HTTP中永远是这样，也就是说一个request只能有一个response。而且这个response也是**被动**的，不能主动发起。

 首先Websocket是基于HTTP协议的，或者说**借用**了HTTP的协议来完成一部分握手。 在握手阶段是一样的

### **如何连接**

ok,我们先看看api

```
// 创建一个socket实例：
const socket = new WebSocket(ws://localhost:9093')
// 打开socket
socket.onopen = (event) => {
    // 发送一个初始化消息
  	socket.send('Hello Server!')
  	 // 服务器有响应数据触发
    socket.onmessage = (event) => { 
        console.log('Client received a message',event)
    }
    // 出错时触发，并且会关闭连接。这时可以根据错误信息进行按需处理
    socket.onerror = (event) => {
  	    console.log('error')
    }
    // 监听Socket的关闭
    socket.onclose = (event) => { 
        console.log('Client notified socket has closed',event)
    }
    // 关闭Socket
    socket.close(1000, 'closing normally') 
 }
```



- 在创建socket实例的时候，new WebSocket()接受两个参数，第一个参数是ws或wss,第二个参数可以选填自定义协议，如果是多协议，可以是数组的方式。
- WebSocket中的send方法不是任何数据都能发送的，现在只能发送三类数据，包括UTF-8的string类型（会默认转化为USVString），ArrayBuffer和Blob，且只有在建立连接后才能使用。（感谢大佬指出错误，已修改）
- 在使用socket.close(code,[reason])关闭连接时，code和reason都是选填的。code是一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭）,而reason是一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于123字节的UTF-8 文本。

 **ws和wss**

我们在上面提到过，创建一个socket实例时可以选填ws和wss来进行通信协议的确定。他们两个其实很像HTTP和HTTPS之间的关系。其中ws表示纯文本通信，而wss表示使用加密信道通信（TCP+TLS）。那为啥不直接使用HTTP而要自定义通信协议呢？这就要从WebSocket的目的说起来，WebSocket的主要功能就是为了给浏览器中的应用与服务器端提供优化的，双向的通信机制，但这不代表WebScoket只能局限于此，它当然还能够用于其他的场景，这就需要他可以通过非HTTP协议来进行数据交换，因此WebSocket也就采用了自定义URI模式，以确保就算没有HTTP，也能进行数据交换。

ws和wss：

- **ws协议**：普通请求，占用与HTTP相同的80端口
- **wss协议**：基于SSL的安全传输，占用与TLS相同的443端口。

注：有些HTTP中间设备有时候可能会不理解WebSocket，而导致各种诸如：盲目连接升级，乱修改内容等问题。而WSS就很好的解决了这个问题，它建立了一台哦端到端的安全通道，这个通道对中间设备模糊了数据，因此中间设备就不能感知到数据，也就无法对请求做一些特殊处理了。

**客户端**

```
GET / HTTP/1.1
Host: localhost:8080
Origin: 
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: w4v7O6xFTi36lq3RNcgctw==
Sec-WebSocket-Protocol: chat, superchat
```

**首先，客户端发起协议升级请求。可以看到，采用的是标准的HTTP报文格式，且只支持GET方法：**

```
Connection: Upgrade：表示要升级协议
Upgrade: websocket：表示要升级到websocket协议。
Sec-WebSocket-Version: 13：表示websocket的版本。如果服务端不支持该版本，需要返回一个Sec-WebSocket-Versionheader，里面包含服务端支持的版本号。
Sec-WebSocket-Key：与后面服务端响应首部的Sec-WebSocket-Accept是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。
```

上面两个就是为了告诉服务器我要的是websocket协议。请注意，别给错了

而`Sec-WebSocket-Key`是一个Base64 encode的值，这个是浏览器随机生成的，告诉服务器：**泥煤，不要忽悠窝，我要验证尼是不是真的是Websocket助理。**

`Sec_WebSocket-Protocol` 是一个用户定义的字符串，用来区分同URL下，不同的服务所需要的协议。简单理解：**今晚我要服务A，别搞错啦~**

**服务端**

```
HTTP/1.1 101 Switching Protocols
Connection:Upgrade
Upgrade: websocket
Sec-WebSocket-Accept: Oy4NRAQ13jhfONC7bP8dTKb4PTU=
Sec-WebSocket-Protocol: chat
```

依然是固定的，告诉客户端即将升级的是Websocket协议，而不是mozillasocket，lurnarsocket或者shitsocket。
然后，Sec-WebSocket-Accept 这个则是经过服务器确认，并且加密过后的 Sec-WebSocket-Key。

Sec-WebSocket-Accept根据客户端请求首部的Sec-WebSocket-Key计算出来。

计算公式为：

- 1）将Sec-WebSocket-Key跟258EAFA5-E914-47DA-95CA-C5AB0DC85B11拼接；
- 2）通过SHA1计算出摘要，并转成base64字符串。

后面的，Sec-WebSocket-Protocol 则是表示最终使用的协议。

 前面提到了，Sec-WebSocket-Key/Sec-WebSocket-Accept在主要作用在于提供基础的防护，减少恶意连接、意外连接。

 **Sec-WebSocket-Key/Accept的作用**

作用大致归纳如下：

- 1）避免服务端收到非法的websocket连接（比如http客户端不小心请求连接websocket服务，此时服务端可以直接拒绝连接）；
- 2）确保服务端理解websocket连接。因为ws握手阶段采用的是http协议，因此可能ws连接是被一个http服务器处理并返回的，此时客户端可以通过Sec-WebSocket-Key来确保服务端认识ws协议。（并非百分百保险，比如总是存在那么些无聊的http服务器，光处理Sec-WebSocket-Key，但并没有实现ws协议。。。）；
- 3）用浏览器里发起ajax请求，设置header时，Sec-WebSocket-Key以及其他相关的header是被禁止的。这样可以避免客户端发送ajax请求时，意外请求协议升级（websocket upgrade）；
- 4）可以防止反向代理（不理解ws协议）返回错误的数据。比如反向代理前后收到两次ws连接的升级请求，反向代理把第一次请求的返回给cache住，然后第二次请求到来时直接把cache住的请求给返回（无意义的返回）；
- 5）Sec-WebSocket-Key主要目的并不是确保数据的安全性，因为Sec-WebSocket-Key、Sec-WebSocket-Accept的转换计算公式是公开的，而且非常简单，最主要的作用是预防一些常见的意外情况（非故意的）。

强调：

Sec-WebSocket-Key/Sec-WebSocket-Accept 的换算，只能带来基本的保障，但连接是否安全、数据是否安全、客户端/服务端是否合法的 ws客户端、ws服务端，其实并没有实际性的保证。

### **解决服务器上消耗资源的问题**

其实我们所用的程序是要经过两层代理的，即**HTTP协议在Nginx等服务器的解析下**，然后再传送给相应的**Handler（PHP等）**来处理。
简单地说，我们有一个非常快速的接**线员（Nginx）**，他负责把问题转交给相应的**客服（Handler）**。
本身**接线员基本上速度是足够的**，但是每次都卡在**客服（Handler）**了，老有**客服**处理速度太慢。，导致客服不够。
Websocket就解决了这样一个难题，建立后，可以直接跟接线员建立持**久连接**，有信息的时候客服想办法通知接线员，然后**接线员**在统一转交给客户。
这样就可以解决客服处理速度过慢的问题了。

 同时，在传统的方式上，要不断的建立，关闭HTTP协议，由于HTTP是非状态性的，每次都要**重新传输identity info（鉴别信息）**，来告诉服务端你是谁。
虽然接线员很快速，但是每次都要听这么一堆，效率也会有所下降的，同时还得不断把这些信息转交给客服，不但浪费客服的**处理时间**，而且还会在网路传输中消耗**过多的流量/时间。**
但是Websocket只需要**一次HTTP握手，所以说整个通讯过程是建立在一次连接/状态中**，也就避免了HTTP的非状态性，服务端会一直知道你的信息，直到你关闭请求，这样就解决了接线员要反复解析HTTP协议，还要查看identity info的信息。
同时由**客户主动询问**，转换为**服务器（推送）有信息的时候就发送（当然客户端还是等主动发送信息过来的。。）**，没有信息的时候就交给接线员（Nginx），不需要占用本身速度就慢的**客服（Handler）**了

## 数据掩码的作用

 

WebSocket协议中，数据掩码的作用是增强协议的安全性。但数据掩码并不是为了保护数据本身，因为算法本身是公开的，运算也不复杂。除了加密通道本身，似乎没有太多有效的保护通信安全的办法。那么为什么还要引入掩码计算呢，除了增加计算机器的运算量外似乎并没有太多的收益（这也是不少同学疑惑的点）。答案还是两个字： 安全。但并不是为了防止数据泄密，而是为了防止早期版本的协议中存在的代理缓存污染攻击（proxy cache poisoning attacks）等问题

### **代理缓存污染攻击** 

在正式描述攻击步骤之前，我们假设有如下参与者：

- 攻击者、攻击者自己控制的服务器（简称“邪恶服务器”）、攻击者伪造的资源（简称“邪恶资源”）；
- 受害者、受害者想要访问的资源（简称“正义资源”）；
- 受害者实际想要访问的服务器（简称“正义服务器”）；
- 中间代理服务器。

攻击步骤一：

- 1）攻击者浏览器 向 邪恶服务器 发起WebSocket连接。根据前文，首先是一个协议升级请求；
- 2）协议升级请求 实际到达 代理服务器；
- 3）代理服务器 将协议升级请求转发到 邪恶服务器；
- 4）邪恶服务器 同意连接，代理服务器 将响应转发给 攻击者。

由于 upgrade 的实现上有缺陷，代理服务器 以为之前转发的是普通的HTTP消息。因此，当协议服务器 同意连接，代理服务器 以为本次会话已经结束。 

攻击步骤二：

- 1）攻击者 在之前建立的连接上，通过WebSocket的接口向 邪恶服务器 发送数据，且数据是精心构造的HTTP格式的文本。其中包含了 正义资源 的地址，以及一个伪造的host（指向正义服务器）。（见后面报文）；
- 2）请求到达 代理服务器 。虽然复用了之前的TCP连接，但 代理服务器 以为是新的HTTP请求；
- 3）代理服务器 向 邪恶服务器 请求 邪恶资源；
- 4）邪恶服务器 返回 邪恶资源。代理服务器 缓存住 邪恶资源（url是对的，但host是 正义服务器 的地址）。

到这里，受害者可以登场了：

- 1）受害者 通过 代理服务器 访问 正义服务器 的 正义资源；
- 2）代理服务器 检查该资源的url、host，发现本地有一份缓存（伪造的）；
- 3）代理服务器 将 邪恶资源 返回给 受害者；
- 4）受害者 卒。

**附：**

前面提到的精心构造的“HTTP请求报文”：

```
Client → Server:
POST /path/of/attackers/choice HTTP/1.1 Host: host-of-attackers-choice.com Sec-WebSocket-Key: <connection-key>
Server → Client:
HTTP/1.1 200 OK
Sec-WebSocket-Accept: <connection-key>
```

### **当前解决方案**

 最初的提案是对数据进行加密处理。基于安全、效率的考虑，最终采用了折中的方案：对数据载荷进行掩码处理。需要注意的是，这里只是限制了浏览器对数据载荷进行掩码处理，但是坏人完全可以实现自己的WebSocket客户端、服务端，不按规则来，攻击可以照常进行。但是对浏览器加上这个限制后，可以大大增加攻击的难度，以及攻击的影响范围。如果没有这个限制，只需要在网上放个钓鱼网站骗人去访问，一下子就可以在短时间内展开大范围的攻击。

**接下来看一些实现代码**

```
io.on('connection', function (socket) {
    // 当客户端发出“new message”时，服务端监听到并执行相关代码
    socket.on('new message', function (data) {
        // 广播给用户执行“new message”
        socket.broadcast.emit('new message', {});
    });
    
    // 当客户端发出“add user”时，服务端监听到并执行相关代码
    socket.on('add user', function (username) {
        socket.username = username;
        //服务端告诉当前用户执行'login'指令
        socket.emit('login', {});
    });
    
    // 当用户断开时执行此指令
    socket.on('disconnect', function () {});
});
// 发送到当前请求socket通信的客户端
socket.emit('message', "this is a test");

// 发送给所有客户端，除了发件人
socket.broadcast.emit('message', "this is a test");

// 发送给“游戏”房间（频道）中的所有客户，发件人除外
socket.broadcast.to('game').emit('message', 'nice game');

// 发送给所有的客户，包括发件人
io.sockets.emit('message', "this is a test");

// 发送给“游戏”房间（频道）的所有客户，包括发件人
io.sockets.in('game').emit('message', 'cool game');

// 发送给指定的socketid
io.sockets.socket(socketid).emit('message', 'for your eyes only');
```

最后看一下websocket和http的一些区别



- WebSocket是一种双向通信协议。在建立连接后，WebSocket服务器端和客户端都能主动向对方发送或接收数据，就像Socket一样；
- WebSocket需要像TCP一样，先建立连接，连接成功后才能相互通信。

传统HTTP客户端与服务器请求响应模式如下图所示：

![img](https://pic3.zhimg.com/80/v2-c99efde0caccb49814ea83c126b0e18a_hd.jpg)

WebSocket模式客户端与服务器请求响应模式如下图：

![img](https://pic1.zhimg.com/80/v2-e4128e588c6c21216319351ee7eb0bac_hd.jpg) 

上图对比可以看出，相对于传统HTTP每次请求-应答都需要客户端与服务端建立连接的模式，WebSocket是类似Socket的TCP长连接通讯模式。一旦WebSocket连接建立后，后续数据都以帧序列的形式传输。在客户端断开WebSocket连接或Server端中断连接前，不需要客户端和服务端重新发起连接请求。在海量并发及客户端与服务器交互负载流量大的情况下，极大的节省了网络带宽资源的消耗，有明显的性能优势，且客户端发送和接受消息是在同一个持久连接上发起，实时性优势明显。

相比HTTP长连接，WebSocket有以下特点：

- 是真正的全双工方式，建立连接后客户端与服务器端是完全平等的，可以互相主动请求。而HTTP长连接基于HTTP，是传统的客户端对服务器发起请求的模式。
- HTTP长连接中，每次数据交换除了真正的数据部分外，服务器和客户端还要大量交换HTTP header，信息交换效率很低。Websocket协议通过第一个request建立了TCP连接之后，之后交换的数据都不需要发送 HTTP header就能交换数据，这显然和原有的HTTP协议有区别所以它需要对服务器和客户端都进行升级才能实现（主流浏览器都已支持HTML5）。此外还有 multiplexing、不同的URL可以复用同一个WebSocket连接等功能。这些都是HTTP长连接不能做到的。

**下面是一些大神评论，没看到这里的只能说一句，好尴尬啊**

> WebSocket 根本不是 HTML5 的东西。
>
> WebSocket 是一个协议，归属于 IETF。
> WebSocket API 是一个 Web API，归属于 W3C。
> 两个规范是独立发布的。
>
> 广义上的 HTML5 里面包含的是 WebSocket API，并不是 WebSocket。简单的说，可以把 WebSocket 当成 HTTP，WebSocket API 当成 Ajax。
>
> 只是因为 WebSocket 对于非 Web 部分的意义不大（毕竟直接用 TCP 就好了），所以从现实角度的概率上而言 WebSocket 目前基本只会通过 Web API 里的 WebSocket API 来使用。
>
>  

>   先说结论：“websocket出现是因为浏览器不给开后门”，“不是WebSocket基于HTTP，相反，可以看成可以看成可以看成HTTP基于WebSocket”。要理解为什么会出现HTTP，WebSocket，可以做这样一个假设。假设平行宇宙1984年（我懒的查数据，所以就说一个平行宇宙了，随便看看吧），人们使用TCP协议进行通讯，假设那时候还没有网页浏览器这一说法，大家都是通过各种软件直接通讯。
>
> 假设到了1986年，人们使用浏览器来浏览网页，假设当时电脑时100MHz，100M内存。对TCP协议熟悉一点，大概也能猜到一个TCP链接，会消耗一点点内存，假设是32k（具体我也不知道），那么如果一台几万块钱的服务器最大能支持100M/32k＝3200个连接。显然，如果一个公司，面向全世界提供网页服务，如果使用TCP，最多也就3200个人同时看网页。
> 于是服务器要求“所有客户端，打开网页之后，必须关闭TCP连接”。这就是（猜测的）HTTP的初衷了。
> 按照这个协议，服务器接受TCP连接，几秒钟之内读取数据，检验之后，回复数据，断开连接。所谓的节省“资源”也没说明白到底节省了什么“资源”。等到二十年后，平行宇宙的2004年，QQ桌面版好好的，QQ网页版用的越来越多。由于浏览器都是连接之后很快断开，QQ网页版，只能靠各种polling方式持续交互数据（HTTP keep-alive也有自己的缺点，其他答主讲的很好），浪费大量的带宽（这时候带宽的费用就大了），同时客户端收到消息也不及时，还有各种其它问题。
> QQ网页版想直接用TCP协议长时间连接，但是QQ网页版能做的，都是浏览器允许做的。可以说，websocket的出现，就是因为浏览器不支持TCP直连，不给开后门。
> 于是“希望所有的浏览器都能够直接进行TCP连接”，于是浏览器出现了websocket协议。所以，因为某些原因，人们在TCP上面弄了一个HTTP协议，把TCP支持的一些特性删除了，然后若干年之后想要那些被删除的特性，返回TCP，于是出现了WebSocket。
> WebSocket实际上可以看作HTTP的降级！“不是WebSocket基于HTTP，而是可以看成可以看成可以看成HTTP基于WebSocket”。具体协议细节其他答主讲的很好，就不重复了。包括从串口模拟出TCP，再模拟出HTTP，流接口变成块接口，都无所谓了。

如果你还对WebSocket的数据帧格式感兴趣，[请猛戳](https://juejin.im/entry/5a5c559c518825734859ee5e)

好的，本文到此结束，如果你对其他知识，或者不知道自己想了解什么，[请猛戳](https://github.com/nvnvyezi/Daily-notes)https://github.com/nvnvyezi/Daily-notes，里面有你想不到的啊哈哈

[原文地址1](https://blog.csdn.net/dbs1215/article/details/48953589)

**RSA原理**

1. 随机选取两个比较大的质数p，q，且p!=q，计算N=p*q

2. 根据欧拉函数（扎到小于N并且是质数的个数），求出r

3. 找出一个小于r的整数e，求得e关于r的模反元素（）d，（模反元素存在，当且仅当e与r互质）

   > 模逆元也称为**模倒数**，或者**模逆元**。
   >
   > 一[整数](https://zh.wikipedia.org/wiki/%E6%95%B4%E6%95%B0)a对[同余](https://zh.wikipedia.org/wiki/%E5%90%8C%E9%A4%98)n之**模逆元**是指满足以下公式的整数 b
   >
   > ![](/media/nvnvyezi/linux_software/linux-web/Daily-notes/网络相关/be54db4848231e9f72f61b746a27d6a0aeace369.svg)
   >
   > 也可以写成以下的式子
   >
   > ![](/media/nvnvyezi/linux_software/linux-web/Daily-notes/网络相关/297023f006cd9486fa4192b391dbc819dd8f89e1.svg)
   >
   > 整数 a 对模数 n 之模逆元存在的[充分必要条件](https://zh.wikipedia.org/wiki/%E5%85%85%E5%88%86%E5%BF%85%E8%A6%81%E6%A2%9D%E4%BB%B6)是 a 和 n [互素](https://zh.wikipedia.org/wiki/%E4%BA%92%E8%B3%AA)，若此模逆元存在，在模数 n 下的除法可以用和对应模逆元的乘法来达成，此概念和实数除法的概念相同。

**例子**

假设Alice和Bob又要相互通信，这次用的是非对称加密。

1. Alice 随机取大质数P1=53，P2=59，那N=53*59=3127，φ ( n )=3016，取一个e=3，计算出d=2011。
2. 只将n=3127，e=3 作为公钥传给Bob。
3. 假设Bob需要加密的明文m=89，c = 89^3 mod 3127=1394，于是Bob传回c=1394
4. Alice使用c^d mod n = 1394^2011 mod 3127，就能得到明文m=89。
   回过头来看看，攻击者能截取到n=3127，e=3，c=1394，然而他仍然无法不通过d来进行密文解码

**在巩固一遍**

- 找两个比较大的质数p,q，求出N=p*q
- 由欧拉函数找出r，也就是找出小于N的所有质数的和r，r=(p-1)*(q-1);
- 接着找出小于r的整数e，并且e和r互质，求出e关于r的模反元素d。
- (N,e)就是公钥，(N,d)就是私钥。