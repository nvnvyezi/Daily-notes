###**renderer**

**Chrome包含了一个Browser进程和多个Renderer进程。**

* Chrome最核心的部件主要有三个：Browser、Renderer、Webkit。Browser是老大，控制了所有的I/O、网络传输、浏览器主界面等工作，Renderer顾名思义，主要负责渲染工作，并由Browser进程驱动，Chrome支持每一个Renderer为一个独立进程模式，也就是在Chrome中看到的每一个Tab页面都可以是一个独立进程，某一个Tab页面Crash，不影响其他页面的运行。Renderer进程的实际渲染工作由Webkit库来完成。

* 每一个Renderer进程中都包含了一个RenderProcess对象，其主要工作是负责Renderer进程和Browser的通讯。对应的在Browser进程中为每一个Renderer进程提供了一个RenderProcessHost对象（Renderer进程中包含了不同类型的RenderProcessHost对象）。这个对象负责与各个Renderer进程通讯。Browser进程和Renderer进程之间的通讯采用IPC方式（Inter-process Communication）。
  > **IPC是Inter-Process Communication的缩写，意为进程间通信或者跨进程通信，是指两个进程进行数据交换的过程。**
  > https://blog.csdn.net/qq_26420489/article/details/52278945

- Chrome的进程模型中Process-per-site-instance和Process-per-site两种模式下，多个Tab页面同属于一个进程。为了适应这种情况，Chrome提供了另外的解决方案。在每一个Renderer进程中，包含了一个或者多个RenderView对象，这个对象被RenderProcess对象管理。每一个Tab页面就是一个RenderView。但在Process-per-site-instance和Process-per-site两种模式下，有可能多个Tab页面都同属于一个Renderer进程。被同一个RenderProcess对象管理。为了区分每一个RenderView，Renderer进程为每一个RenderView分配了一个viewID，这个ID在同一个Renderer进程内是唯一的。但不保证全局唯一。每一个RenderView与Browser进程通讯时，必须提供RenderProcess对象和ViewID两个信息，才能指示当前的RenderView。对应的在Browser进程中也包含了一个RenderViewHost对象，负责与Renderer进程中的RenderView对象通讯。

 **Chrome支持以下几种进程模型：**

	1. Process-per-site-instance：就是你打开一个网站，然后从这个网站链开的一系列网站都属于一个进程。这是Chrome的默认模式。
	2. Process-per-site： 同域名范畴的网站放在一个进程，比如www.google.com和www.google.com/bookmarks就属于一个域名内（google有自己的判定机制），不论有没有互相打开的关系，都算作是一个进程中。用命令行--process-per-site开启。
	3. Process-per-tab：这个简单，一个tab一个process，不论各个tab的站点有无联系，就和宣传的那样。用--process-per-tab开启。
	4. Single Process：这个很熟悉了吧，传统浏览器的模式，没有多进程只有多线程，用--single-process开启。

**Browser进程和Renderer进程(如何利用WebKit渲染网页)**

​	![](./pasted_image.png)

 * 最下面的就是WebKit接口层，一般基于WebKit接口层的浏览器直接在上面构建，而没有引入复杂的多进程架构。
* 然后，在WebKit接口层上面就是Chromium基于WebKit的接口层而引入的黏附层，它的出现主要是因为Chromium中的一些类型和WebKit内部不一致，所以需要一个简单的桥接层。
* 再上面的就是Renderer，它主要处理进程间通信，接受来自Browser进程的请求，并调用相应的WebKit接口层。同时，将WebKit的处理结果发送回去。上面这些介绍的层都是在Renderer进程中工作的。
* 下面就进入了Browser进程，与Renderer相对应的就是RendererHost，其目的也是处理同Renderer进程之间的通信。不过RendererHost是给Renderer进程发送请求并接收来自Renderer进程的结果。
* Web Contents表示的就是网页的内容，因为网页可能有多个需要绘制的内容，例如弹出的对话框内容，所以这里是“Contents”。它同时包括显示网页内容的一个子窗口（在桌面系统上），这个子窗口最后被嵌入浏览器的用户界面，作为它的一个标签页。