```
var Ajax={
  get: function(url, fn) {
    // XMLHttpRequest对象用于在后台与服务器交换数据   
    var xhr = new XMLHttpRequest();            
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      // readyState == 4说明请求已完成
      if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { 
        // 从服务器获得数据 
        fn.call(this, xhr.responseText);  
      }
    };
    xhr.send();
  },
  // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
  post: function (url, data, fn) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    // 添加http头，发送信息至服务器时内容编码类型
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
        fn.call(this, xhr.responseText);
      }
    };
    xhr.send(data);
  }
}
```



**注释：**

\1. open(method, url, async) 方法需要三个参数:

　 method：发送请求所使用的方法（GET或POST）；与POST相比，GET更简单也更快，并且在大部分情况下都能用；然而，在以下情况中，请使用POST请求：

- 无法使用缓存文件（更新服务器上的文件或数据库）
- 向服务器发送大量数据（POST 没有数据量限制）
- 发送包含未知字符的用户输入时，POST 比 GET 更稳定也更可靠

　url：规定服务器端脚本的 URL(该文件可以是任何类型的文件，比如 .txt 和 .xml，或者服务器脚本文件，比如 .asp 和 .php （在传回响应之前，能够在服务器上执行任务）)；

　async：规定应当对请求进行异步（true）或同步（false）处理；true是在等待服务器响应时执行其他脚本，当响应就绪后对响应进行处理；false是等待服务器响应再执行。

\2. send() 方法可将请求送往服务器。

\3. onreadystatechange：存有处理服务器响应的函数，每当 readyState 改变时，onreadystatechange 函数就会被执行。

\4. readyState：存有服务器响应的状态信息。

- 0: 请求未初始化（代理被创建，但尚未调用 open() 方法）
- 1: 服务器连接已建立（`open`方法已经被调用）
- 2: 请求已接收（`send`方法已经被调用，并且头部和状态已经可获得）
- 3: 请求处理中（下载中，`responseText` 属性已经包含部分数据）
- 4: 请求已完成，且响应已就绪（下载操作已完成）

\5. responseText：获得字符串形式的响应数据。

6. setRequestHeader()：POST传数据时，用来添加 HTTP 头，然后send(data)，注意data格式；GET发送信息时直接加参数到url上就可以，比如url?a=a1&b=b1。

response的类型有两种：字符串类型和XML文本。两种回应的不同提取如下：

```
responseText 属性返回字符串形式的响应：


document.getElementById("myDiv").innerHTML=xmlhttp.responseText;


如果来自服务器的响应是 XML，需要作为 XML 对象进行解析，使用 responseXML ：
xmlDoc=xmlhttp.responseXML; //获取服务器响应的XML文本并转换得到XMLDOM对象
txt="";
x=xmlDoc.getElementsByTagName("ARTIST");//通过XMLDOM对象调用方法来获取XML对象中的内容
for (i=0;i<x.length;i++) {
txt=txt + x[i].childNodes[0].nodeValue + "<br>"; }
 
document.getElementById("myDiv").innerHTML=txt;//把获取到的内容通过document对象更新到网页内容去
```



###  三、常用的编码方式

form的enctype属性为编码方式，常用有两种：application/x-www-form-urlencoded和multipart/form-data，默认为application/x-www-form-urlencoded。

为什么要设置请求头

**默认情况下，服务器对post请求和提交表单的请求不会一视同仁，需要服务器端有程序读取发送过来的原始数据，并从中解析出有用的部分。不过，可以模仿表单提交。。。**

## 1.x-www-form-urlencoded

当action为get时候，浏览器用x-www-form-urlencoded的编码方式把form数据转换成一个字串（name1=value1&name2=value2…），然后把这个字串append到url后面，用?分割，加载这个新的url。

## 2.multipart/form-data

当action为post时候，浏览器把form数据封装到http body中，然后发送到server。 如果没有type=file的控件，用默认的application/x-www-form-urlencoded就可以了。 但是如果有type=file的话，就要用到multipart/form-data了。浏览器会把整个表单以控件为单位分割，并为每个部分加上Content-Disposition(form-data或者file),Content-Type(默认为text/plain),name(控件name)等信息，并加上分割符(boundary)。

### ajax工作原理



    Ajax指Asynchronous JavaScript and XML（异步的 JavaScript 和 XML），最大的优点是在不重新加载整个页面的情况下，可以与服务器交换数据并更新部分网页内容。而实现的原理基础就是：网页DOM对象可以精确地对网页中的部分内容进行操作、XML作为单纯的数据存储载体使得客户端与服务器交换的只是网页内容的数据而没有网页样式等等的附属信息、XMLHttpRequest是与浏览器本身内置的request相互独立的与服务器交互的请求对象。

![img](https://images2015.cnblogs.com/blog/1018541/201612/1018541-20161202170336021-461606131.png)

**同步和异步**　

异步传输是面向字符的传输，它的单位是字符；而同步传输是面向比特的传输，它的单位是桢，它传输的时候要求接受方和发送方的时钟是保持一致的。

具体来说，异步传输是将比特分成小组来进行传送。一般每个小组是一个8位字符，在每个小组的头部和尾部都有一个开始位和一个停止位，它在传送过程中接收方和发送方的时钟不要求一致，也就是说，发送方可以在任何时刻发送这些小组，而接收方并不知道它什么时候到达。一个最明显的例子就是计算机键盘和主机的通信，按下一个键的同时向主机发送一个8比特位的ASCII代 码，键盘可以在任何时刻发送代码，这取决于用户的输入速度，内部的硬件必须能够在任何时刻接收一个键入的字符。这是一个典型的Ajax的原理简单来说通过XmlHttpRequest对象来向服务器发异步请求，从服务器获得数据，然后用javascript来操作DOM而更新页面。这其中最关键的一步就是从服务器获得请求数据。要清楚这个过程和原理，我们必须对 XMLHttpRequest有所了解。异步传输过程。异步传输存在 一个潜在的问题，即接收方并不知道数据会在什么时候到达。在它检测到数据并做出响应之前，第一个比特已经过去了。这就像有人出乎意料地从后面走上来跟你说 话，而你没来得及反应过来，漏掉了最前面的几个词。因此，每次异步传输的信息都以一个起始位开头，它通知接收方数据已经到达了，这就给了接收方响应、接收 和缓存数据比特的时间；在传输结束时，一个停止位表示该次传输信息的终止。按照惯例，空闲（没有传送数据）的线路实际携带着一个代表二进制1的信号。异步传输的开始位使信号变成0，其他的比特位使信号随传输的数据信息而变化。最后，停止位使信号重新变回1，该信号一直保持到下一个开始位到达。例如在键盘上数字“1”，按照8比特位的扩展ASCII编码，将发送“00110001”，同时需要在8比特位的前面加一个起始位，后面一个停止位。

同步传输的比特分组要大得多。它不是独立地发送每个字符，每个字符都有自己的开始位和停止位，而是把它们组合起来一起发送。我们将这些组合称为数据帧，或简称为帧。

　　数据帧的第一部分包含一组同步字符，它是一个独特的比特组合，类似于前面提到的起始位，用于通知接收方一个帧已经到达，但它同时还能确保接收方的采样速度和比特的到达速度保持一致，使收发双方进入同步。

　　帧的最后一部分是一个帧结束标记。与同步字符一样，它也是一个独特的比特串，类似于前面提到的停止位，用于表示在下一帧开始之前没有别的即将到达的数据了。

　　同步传输通常要比异步传输快速得多。接收方不必对每个字符进行开始和停止的操作。一旦检测到帧同步字符，它就在接下来的数据到达时接收它们。另外，同步传输的开销也比较少。例如，一个典型的帧可能有500字节（即4000比特）的数据，其中可能只包含100比特的开销。这时，增加的比特位使传输的比特总数增加2.5%，这与异步传输中25 %的增值要小得多。随着数据帧中实际数据比特位的增加，开销比特所占的百分比将相应地减少。但是，数据比特位越长，缓存数据所需要的缓冲区也越大，这就限制了一个帧的大小。另外，帧越大，它占据传输媒体的连续时间也越长。在极端的情况下，这将导致其他用户等得太久。

### ajax所包含的技术

　　**ajax并非一种新的技术，而是几种原有技术的结合体。它由下列技术组合而成。**

　1.使用CSS和XHTML来表示。

   2. 使用DOM模型来交互和动态显示。

   3.使用XMLHttpRequest来和服务器进行异步通信。

   4.使用javascript来绑定和调用。

-  使用XHTML+CSS来标准化呈现； 
- 使用XML和XSLT进行数据交换及相关操作； 
- 使用XMLHttpRequest对象与Web服务器进行异步数据通信； 
- 使用Javascript操作Document Object Model进行动态显示及交互；  
- 使用JavaScript绑定和处理所有数据。

在上面几中技术中，除了XmlHttpRequest对象以外，其它所有的技术都是基于web标准并且已经得到了广泛使用的，XMLHttpRequest虽然目前还没有被W3C所采纳，但是它已经是一个事实的标准，因为目前几乎所有的主流浏览器都支持它。

### ajax缺点

1.  ajax干掉了back按钮，即对浏览器后退机制的破坏。后退按钮是一个标准的web站点的重要功能，但是它没法和js进行很好的合作。这是ajax所带来的一个比较严重的问题，因为用户往往是希望能够通过后退来取消前一次操作的。那么对于这个问题有没有办法？答案是肯定的，用过Gmail的知道，Gmail下面采用的ajax技术解决了这个问题，在Gmail下面是可以后退的，但是，它也并不能改变ajax的机制，它只是采用的一个比较笨但是有效的办法，即用户单击后退按钮访问历史记录时，通过创建或使用一个隐藏的IFRAME来重现页面上的变更。（例如，当用户在Google Maps中单击后退时，它在一个隐藏的IFRAME中进行搜索，然后将搜索结果反映到Ajax元素上，以便将应用程序状态恢复到当时的状态。）但是，虽然说这个问题是可以解决的，但是它所带来的开发成本是非常高的，和ajax框架所要求的快速开发是相背离的。这是ajax所带来的一个非常严重的问题。

​     2、安全问题

技术同时也对IT企业带来了新的安全威胁，ajax技术就如同对企业数据建立了一个直接通道。这使得开发者在不经意间会暴露比以前更多的数据和服务器逻辑。ajax的逻辑可以对客户端的安全扫描技术隐藏起来，允许黑客从远端服务器上建立新的攻击。还有ajax也难以避免一些已知的安全弱点，诸如跨站点脚步攻击、SQL注入攻击和基于credentials的安全漏洞等。

​     3、对搜索引擎的支持比较弱。

​     4、破坏了程序的异常机制。至少从目前看来，像ajax.dll，ajaxpro.dll这些ajax框架是会破坏程序的异常机制的。关于这个问题，我曾经在开发过程中遇到过，但是查了一下网上几乎没有相关的介绍。后来我自己做了一次试验，分别采用ajax和传统的form提交的模式来删除一条数据……给我们的调试带来了很大的困难。

​     5、另外，像其他方面的一些问题，比如说违背了url和资源定位的初衷。例如，我给你一个url地址，如果采用了ajax技术，也许你在该url地址下面看到的和我在这个url地址下看到的内容是不同的。这个和资源定位的初衷是相背离的。

​     6、一些手持设备（如手机、PDA等）现在还不能很好的支持ajax，比如说我们在手机的浏览器上打开采用ajax技术的网站时，它目前是不支持的，当然，这个问题和我们没太多关系。



# [XMLHttpRequest 对象](http://www.w3school.com.cn/xml/xml_http.asp)

# [XML DOM - XMLHttpRequest 对象](http://www.w3school.com.cn/xmldom/dom_http.asp)

