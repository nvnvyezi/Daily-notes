![è±è¯­æ¬å­çåæ¡çº¿](http://image.zhangxinxu.com/image/blog/200911/base_line.jpg)

“行高”顾名思意指一行文字的高度。具体来说是指两行文字间基线之间的距离。

CSS中起高度作用的应该就是`height`以及`line-height`了吧！如果一个标签没有定义`height`属性(包括百分比高度)，那么其最终表现的高度一定是由`line-height`起作用

![1531835274565](/tmp/1531835274565.png)

```
    div {
      border: 1px solid red;
      line-height: 0;
    }
```

![1531835309588](/tmp/1531835309588.png)

体验一下line-height的神奇

为什么加入ｌｉｎｅ－ｈｅｉｇｈｔ：０ｄｉｖ就没有撑开，所以不是文字撑开的ｄｉｖ，是ｌｉｎｅ－ｈｅｉｇｈｔ

在上一节简单知道了ｌｉｎｅ boxes ，　知道ｄｉｖ没有设置ｈｅｉｇｈｔ属性的话，实则就是由内部的ｌｉｎｅ　ｂｏｘｅｓ的高度堆起来的，而ｌｉｎｅ　ｂｏｘｅｓ高度实际取决于内部的ｉｎｌｉｎｅ　ｂｏｘｅｓ　谁最高，就采取谁的值．

**行高的垂直居中性**

行高还有一个特性，叫做垂直居中性。`line-height`的最终表现是通过`line boxes`实现的，而无论`line boxes`所占据的高度是多少（无论比文字大还是比文字小），其占据的空间都是与文字内容公用水平中垂线的

**单行文字居中**

把ｌｉｎｅ－ｈｅｉｇｈｔ值设置为你需要的ｂｏｘ的高度

**多行文字居中**

高度不固定直接用ｐａｄｄｉｎｇ撑开

高度固定

```
<p><span>sdsds <br /> sdsdd</span></p>
p {
      border: 1px solid red;
      line-height: 100px;
    }
    span {
      display: inline-block;
      line-height: 1em;
      vertical-align: middle;
    }
```

[图片居中](https://www.zhangxinxu.com/study/200908/img-text-vertical-align.html)

