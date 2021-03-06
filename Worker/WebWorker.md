实例:https://github.com/nvnvyezi/js-demo

====== WebWorker(工作线程) ======
创建日期 星期一 11 六月 2018

**简介**

> Web Worker 是HTML5标准的一部分，这一规范定义了一套 API，它允许一段JavaScript程序运行在主线程之外的另外一个线程中。工作线程允许开发人员编写能够长时间运行而不被用户所中断的后台程序， 去执行事务或者逻辑，并同时保证页面对用户的及时响应，可以将一些大量计算的代码交给web worker运行而不冻结用户界面，

**使用限制**

* Web Worker无法访问DOM节点；
* Web Worker无法访问全局变量或是全局函数；
* Web Worker无法调用alert()或者confirm之类的函数；
* Web Worker无法访问window、document之类的浏览器全局变量；

1.子线程进行计算，不能进行 DOM BOM操作
2.子线程不能跨域，文件需放在同路径中
3.子线程不能套子线程
4.子线程 不和主线程共享数据，而是复制一份儿 哪怕是对象

* 不过Web Worker中的Javascript依然可以使用setTimeout(),setInterval()之类的函数，也可以使用XMLHttpRequest对象来做Ajax通信。

**特征**
* 能够长时间运行（响应），
* 理想的启动性能以及理想的内存消耗。
* Web Worker 允许开发人员编写能够长时间运行而不被用户所中断的后台程序，去执行事务或者逻辑，并同时保证页面对用户的及时响应。

===== 详解 HTML5 工作线程原理 =====

传统上的线程可以解释为轻量级进程，它和进程一样拥有独立的执行控制，一般情况下由操作系统负责调度。而在 HTML5 中的多线程是这样一种机制，它允许在 Web 程序中并发执行多个 JavaScript 脚本，每个脚本执行流都称为一个线程，彼此间互相独立，并且有浏览器中的 JavaScript 引擎负责管理。

==== webWorker线程类型 ====


1. === === 专用线程：Dedicated Worker === ===




>　随当前页面的关闭而结束；这意味着Dedicated web worker只能被创建它的页面访问

* **创建方式**

在创建专用线程的时候，需要给 Worker 的构造函数提供一个指向 JavaScript 文件资源的 URL或者Blob对象（Blob对象就是一个包含有只读原始数据类文件对象），这也是创建专用线程时 Worker 构造函数所需要的唯一参数。当这个构造函数被调用之后，一个工作线程的实例便会被创建出来。下面是创建专用线程代码示例：

	__var worker = new Worker('dedicated.js');__

* **与专用线程通信**

专用线程在运行的过程中会在后台使用 MessagePort 对象，而 MessagePort 对象支持 HTML5 中多线程提供的所有功能，例如：可以发送和接受结构化数据（JSON 等），传输二进制数据，并且支持在不同端口中传输数据等。

为了在页面主程序接收从专用线程传递过来的消息，我们需要使用工作线程的 onmessage 事件处理器，定义 onmessage 的实例代码如下：

	 接收来至工作线程示例代码
	__worker.onmessage = function (event) { ... };__

另外，开发人员也可以选择使用 addEventListener 方法，它最终的实现方式和作用和 onmessage 相同。

就像前面讲述的，专用线程会使用隐式的 MessagePort 实例，当专用线程被创建的时候，MessagePort 的端口消息队列便被主动启用。因此，这也和工作线程接口中定义的 start 方法作用一致。

如果要想一个专用线程发送数据，那么我们需要使用线程中的 postMessage 方法。专用线程不仅仅支持传输二进制数据，也支持结构化的 JavaScript 数据格式。在这里有一点需要注意，为了高效地传输 ArrayBuffer 对象数据，需要在 postMessage 方法中的第二个参数中指定它。实例代码如下：

	高效的发送 ArrayBuffer 数据代码
	__worker.postMessage({ __
	__ operation: 'list_all_users', __
	__ //ArrayBuffer object __
	__ input: buffer, __
	__ threshold: 0.8, __
	__}, [buffer]);__

2. === 共享线程 Shared Worker ===


> Shared Worker则可以被多个页面所共享（同域情况下）, 可以被与之相关联的多个页面访问，只有当所有关联的的页面都关闭的时候，该Shared web worker才会结束。

* **共享线程**

共享线程可以由两种方式来定义：一是通过指向 JavaScript 脚本资源的 URL 来创建，二是通过显式的名称。当由显式的名称来定义的时候，由创建这个共享线程的第一个页面中使用 URL 会被用来作为这个共享线程的 JavaScript 脚本资源 URL。通过这样一种方式，它允许同域中的多个应用程序使用同一个提供公共服务的共享线程，从而不需要所有的应用程序都去与这个提供公共服务的 URL 保持联系。

无论在什么情况下，共享线程的作用域或者是生效范围都是由创建它的域来定义的。因此，两个不同的站点（即域）使用相同的共享线程名称也不会冲突。

* **创建**

创建共享线程可以通过使用 SharedWorker() 构造函数来实现，这个构造函数使用 URL 作为第一个参数，即是指向 JavaScript 资源文件的 URL，同时，如果开发人员提供了第二个构造参数，那么这个参数将被用于作为这个共享线程的名称。创建共享线程的代码示例如下：

	__var worker = new SharedWorker('sharedworker.js', ’ mysharedworker ’ );__

* **与共享线程通信**

共享线程的通信也是跟专用线程一样，是通过使用隐式的 MessagePort 对象实例来完成的。当使用 SharedWorker() 构造函数的时候，这个对象将通过一种引用的方式被返回回来。我们可以通过这个引用的 port 端口属性来与它进行通信。发送消息与接收消息的代码示例如下：

	发送消息与接收消息
	__// 从端口接收数据 , 包括文本数据以及结构化数据__
	__1. worker.port.onmessage = function (event) { define your logic here... }; __
	__// 向端口发送普通文本数据__
	__2. worker.port.postMessage('put your message here … '); __
	__// 向端口发送结构化数据__
	__3. worker.port.postMessage({ username: 'usertext'; live_city: __
	__['data-one', 'data-two', 'data-three','data-four']});__
	
	＞ 第一个我们使用 onmessage 事件处理器来接收消息，第二个使用 postMessage 来发送普通文本数据，第三个使用 postMessage 来发送结构化的数据，这里我们使用了 JSON 数据格式。



* **使用**

  - 专用线程

  **index.html** 

  __<!DOCTYPE html>__
  __<html lang="en">__
  __<head>__
  __    <meta charset="UTF-8">__
  __    <title>webWorker</title>__
  __</head>__
  __<body>__
  __    <script>__
  __        var worker = new Worker("worker.js");__
  __        worker.postMessage("123456");__

  __        worker.onmessage = function (e) {__
  __            console.log(e.data)__
  __        };__
  __    </script>__
  __</body>__
  __</html>__

  **worker.js**

  __onmessage = function (e) {__
  __    console.log(e.data);__
  __    postMessage("2222")__
  __};__

  **结束worker**

  __worker.terminate();__
  {{./pasted_image.png}}


  -共享线程

  > 对于 Web Worker ，一个 tab 页面只能对应一个 Worker 线程，是相互独立的；
  而 SharedWorker 提供了能力能够让不同标签中页面共享的同一个 Worker 脚本线程；
  当然，有个很重要的限制就是它们需要满足同源策略，也就是需要在同域下；
  在页面（可以多个）中实例化 Worker 线程：

  __// main.js__

  __var myWorker = new SharedWorker("worker.js");__

  __myWorker.port.start();__

  __myWorker.port.postMessage("hello, I'm main");__

  __myWorker.port.onmessage = function(e) {__
  __  console.log('Message received from worker');__
  __}__

  __// worker.js__
  __onconnect = function(e) {__
  __  var port = e.ports[0];__

  __  port.addEventListener('message', function(e) {__
  __    var workerResult = 'Result: ' + (e.data[0]);__
  __    port.postMessage(workerResult);__
  __  });__
  __  port.start();__
  __}__



### Worker上下文

Worker执行的上下文，与主页面执行时的上下文并不相同，最顶层的对象并不是window，而是个一个叫做WorkerGlobalScope的东东，所以无法访问window、以及与window相关的DOM API，但是可以与setTimeout、setInterval等协作。

WorkerGlobalScope作用域下的常用属性、方法如下：

1、self

我们可以使用 WorkerGlobalScope 的 self 属性来或者这个对象本身的引用

2、location

　　location 属性返回当线程被创建出来的时候与之关联的 WorkerLocation 对象，它表示用于初始化这个工作线程的脚步资源的绝对 URL，即使页面被多次重定向后，这个 URL 资源位置也不会改变。

3、close

　　关闭当前线程

4、importScripts

　　我们可以通过importScripts()方法通过url在worker中加载库函数

5、XMLHttpRequest

　　有了它，才能发出Ajax请求

6、setTimeout/setInterval以及addEventListener/postMessage

### 终止 terminate()

在主页面上调用terminate()方法，可以立即杀死 worker 线程，不会留下任何机会让它完成自己的操作或清理工作。另外，Worker也可以调用自己的 close() 方法来关闭自己



=== 工作线程事件处理模型 ===

当工作线程被一个具有 URL 参数的构造函数创建的时候，它需要有一系列的处理流程来处理和记录它本身的数据和状态。下面我们给出了工作线程的处理模型如下（注：由于 W3C 中工作线程的规范依然在更新，您读到这篇文章的时候可能看到已不是最新的处理模型，建议参考 W3C 中的最新规范）：

1. 创建一个独立的并行处理环境，并且在这个环境里面异步的运行下面的步骤。

2. 如果它的全局作用域是 SharedWorkerGlobalScope 对象，那么把最合适的应用程序缓存和它联系在一起。

3. 尝试从它提供的 URL 里面使用 synchronous 标志和 force same-origin 标志获取脚本资源。

4. 新脚本创建的时候会按照下面的步骤：

	* 创建这个脚本的执行环境。
	* 使用脚本的执行环境解析脚本资源。
	* 设置脚本的全局变量为工作线程全局变量。
	* 设置脚本编码为 UTF-8 编码。


5. 启动线程监视器，关闭孤儿线程。

6. 对于挂起线程，启动线程监视器监视挂起线程的状态，即时在并行环境中更改它们的状态。

7. 跳入脚本初始点，并且启动运行。

8. 如果其全局变量为 DedicatedWorkerGlobalScope 对象，然后在线程的隐式端口中启用端口消息队列。

9. 对于事件循环，等待一直到事件循环列表中出现新的任务。

10. 首先运行事件循环列表中的最先进入的任务，但是用户代理可以选择运行任何一个任务。

11. 如果事件循环列表拥有存储 mutex 互斥信号量，那么释放它。

12. 当运行完一个任务后，从事件循环列表中删除它。

13. 如果事件循环列表中还有任务，那么继续前面的步骤执行这些任务。

14. 如果活动超时后，清空工作线程的全局作用域列表。

15. 释放工作线程的端口列表中的所有端口。

=== 工作线程应用范围和作用域 ===


工作线程的全局作用域仅仅限于工作线程本身，即在线程的生命周期内有效。规范中 WorkerGlobalScope 接口代表了它的全局作用域，下面我们来看下这个接口的具体实施细节（WorkerGlobalScope 抽象接口）。

清单 5. WorkerGlobalScope 抽象接口代码
__interface WorkerGlobalScope { __
__ readonly attribute WorkerGlobalScope self; __
__ readonly attribute WorkerLocation location; __

__ void close(); __
__          attribute Function onerror; __
__};__ 
__WorkerGlobalScope implements WorkerUtils; __
__WorkerGlobalScope implements EventTarget;__
我们可以使用 WorkerGlobalScope 的 self 属性来或者这个对象本身的引用。location 属性返回当线程被创建出来的时候与之关联的 WorkerLocation 对象，它表示用于初始化这个工作线程的脚步资源的绝对 URL，即使页面被多次重定向后，这个 URL 资源位置也不会改变。

当脚本调用 WorkerGlobalScope 上的 close()方法后，会自动的执行下面的两个步骤：

1. 删除这个工作线程事件队列中的所有任务。
2. 设置 WorkerGlobalScope 对象的 closing 状态为 true （这将阻止以后任何新的任务继续添加到事件队列中来）。

=== 工作线程生命周期 ===

>  WorkerGlobalScope 接口代表了它的全局作用域

工作线程之间的通信必须依赖于浏览器的上下文环境，并且通过它们的 MessagePort 对象实例传递消息。每个工作线程的全局作用域都拥有这些线程的端口列表，这些列表包括了所有线程使用到的 MessagePort 对象。在专用线程的情况下，这个列表还会包含隐式的 MessagePort 对象。

每个工作线程的全局作用域对象 WorkerGlobalScope 还会有一个工作线程的线程列表，在初始化时这个列表为空。当工作线程被创建的时候或者拥有父工作线程的时候，它们就会被填充进来。

最后，每个工作线程的全局作用域对象 WorkerGlobalScope 还拥有这个线程的文档模型，在初始化时这个列表为空。当工作线程被创建的时候，文档对象就会被填充进来。无论何时当一个文档对象被丢弃的时候，它就要从这个文档对象列举里面删除出来。

在工作线程的生命周期中，定义了下面四种不同类型的线程名称，用以标识它们在线程的整个生命周期中的不同状态：

	* 当一个工作线程的文档对象列举不为空的时候，这个工作线程会被称之为许可线程。（A worker is said to be a permissible worker if its list of the worker's Documents is not empty.）
	* 当一个工作线程是许可线程并且或者拥有数据库事务或者拥有网络连接或者它的工作线程列表不为空的时候，这个工作线程会被称之为受保护的线程。（A worker is said to be a protected worker if it is a permissible worker and either it has outstanding timers, database transactions, or network connections, or its list of the worker's ports is not empty）
	* 当一个工作线程的文档对象列表中的任何一个对象都是处于完全活动状态的时候，这个工作线程会被称之为需要激活线程。（A worker is said to be an active needed worker if any of the Document objects in the worker's Documents are fully active.）
	* 当一个工作线程是一个非需要激活线程同时又是一个许可线程的时候，这个工作线程会被称之为挂起线程。（A worker is said to be a suspendable worker if it is not an active needed worker but it is a permissible worker.）

=== 工作线程Api 接口 ===

**类库和脚本的访问和引入**

对于类库和脚本的访问和引入，规范中规定可以使用 WorkerGlobalScope 对象的 importScripts(urls) 方法来引入网络中的脚本资源。当用户调用这个方法引入资源的时候会执行下面的步骤来完成这个操作：

	1. 如果没有给 importScripts 方法任何参数，那么立即返回，终止下面的步骤。
	2. 解析 importScripts 方法的每一个参数。
	3. 如果有任何失败或者错误，抛出 SYNTAX_ERR 异常。
	4. 尝试从用户提供的 URL 资源位置处获取脚本资源。
	5. 对于 importScripts 方法的每一个参数，按照用户的提供顺序，获取脚本资源后继续进行其它操作。
	
	**最小公倍数和最大公约数**
	__/** __
	__ * 使用 importScripts 方法引入外部资源脚本，在这里我们使用了数学公式计算工具库 math_utilities.js __
	__ * 当 JavaScript 引擎对这个资源文件加载完毕后，继续执行下面的代码。同时，下面的的代码可以访问和调用__
	__ * 在资源文件中定义的变量和方法。__
	__ **/ __
	__ importScripts('math_utilities.js'); __
	 
	__ /** __
	__ * This worker is used to calculate __
	__ * the least common multiple __
	__ * and the greatest common divisor __
	__ */ __
	__ onmessage = function (event) __
	__ { __
	__ var first=event.data.first; __
	__ var second=event.data.second; __
	__ calculate(first,second); __
	__ }; __


​	 
​	__ /* __
​	__ * calculate the least common multiple __
​	__ * and the greatest common divisor __
​	__ */ __
​	__ function calculate(first,second) { __
​	__    //do the calculation work __
​	__ var common_divisor=divisor(first,second); __
​	__ var common_multiple=multiple(first,second); __
​	__    postMessage("Work done! " + __
​	__"The least common multiple is "+common_divisor __
​	__ +" and the greatest common divisor is "+common_multiple); __
​	__ }__


=== 工作导航器对象（WorkerNavigator） ===

在HTML5 中， WorkerUtils 接口的navigator 属性会返回一个工作导航器对象（WorkerNavigator），这个对象定义并且代表了用户代理（即Web 客户端）的标识和状态。因此，用户和Web 脚本开发人员可以在多线程开发过程中通过这个对象来取得或者确定用户的状态。

1. 工作导航器对象（WorkerNavigator）
	a. WorkerUtils 抽象接口的navigator 属性会返回一个WorkerNavigator 用户接口，用于用户代理的识别的状态标识。我们来看下WorkerNavigator 接口的定义。
2. WorkerNavigator 接口定义
	a. WorkerNavigator 接口定义代码
	__interface WorkerNavigator {}; __
	__WorkerNavigator implements NavigatorID; __
	__WorkerNavigator implements NavigatorOnLine;__

**其中，有一点需要注意：如果接口的相对命名空间对象为Window 对象的时候，WorkerNavigator 对象一定不可以存在，即无法再使用这个对象。**

=== 创建与终止线程 ===

工作线程规范中定义了线程的抽象接口类AbstractWorker ，专用线程以及共享线程都继承自该抽象接口。专用线程以及共享线程的创建方法读者可以参考第一小节中的示例代码。下面是此抽象接口的定义。



