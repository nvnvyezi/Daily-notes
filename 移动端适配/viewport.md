### Viewport

浏览器或者（app的webview）用来显示网页的那部分区域

不局限于可视区域的大小，一般情况下移动设备的viewport都比可视区域大。

为了显示传统的为桌面浏览器设计的网站，移动设备上的浏览器都会把默认的viewport设置为980px或1024px（由设备自己决定）

#### layout viewport（布局视口）

CSS布局是相对于布局视口计算的，布局视口大小一般为浏览器默认的viewport，比如Safari iPhone使用980px，Opera 850px，Android WebKit 800px和IE 974px。

#### visual viewport（可视视口）

当前屏幕显示的页面的一部分，可以通过缩放来更改可视视口的大小

#### ideal viewport（理想视口）

宽度等于移动设备的屏幕宽度，目的是不需要用户缩放和横向滚动条就能正常查看网站的内容

窗口大小不固定，由设备而定

### 名词

#### 物理像素

又被称为设备像素，是显示设备中一个最微小的物理部件（显示器上一个个的点）

#### 设备独立像素

又称为密度无关像素，可以认为是计算机坐标系统上的一个点，这个点代表一个虚拟像素（比如说CSS像素），然后由相关系统转换为物理像素

#### 屏幕密度

指一个设备屏幕存在的像素数量，通常以每英寸有多少像素来计算（PPI）

#### CSS像素

一般被称为与设备无关的像素(device-independent pixel)，简称DIPS，默认情况下等于一个物理像素，是一个相对值

当将页面放大一倍，其值代表的物理像素也会增加一倍

#### devicePixelRatio

设备像素比，简称dpr。值为设备物理像素/设备独立像素

#### meta/viewport

移动设备默认的是`layout viewpoint`，可以使用meta标签来达到`ideal viewpoint`

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=no">
```

使当前设备的`viewpoint`的宽度等于屏幕的宽度，同时禁止用户缩放

- `width`控制视口的宽度
  - 可以直接指定确切的数字比如`width=600`
  - 或者指定`width=device-width`，代表缩放为100%时以CSS像素计量的宽度
- `initial-scale`：页面最初加载时的缩放值，为一个数字，可为浮点数
- `maxinum-scale`：允许用户的最大缩放值，为一个数字，可为浮点数
- `mininum-scale`：允许用户的最小缩放值，为一个数字，可为浮点数
- `user-scalable`：允许用户进行缩放，值为“no”或者"yes"

#### Notes

- 只设置`<meta name="viewport" content="width=device-width">`时，iphone和ipad上，无论是竖屏还是横屏，宽度都是竖屏时`ideal viewport`的宽度
- 只设置`<meta name="viewport" content="initial-scale=1">`时也能达到`ideal viewpoint`的效果，注意IE无论是竖屏还是横屏都把宽度设为竖屏时`ideal viewport`的宽度。
- 当`width`设置了数值并且使用了`initial-scale=1`，取值是两者中较大的数，注意在uc9浏览器中取值一直是`ideal viewpoint`的值

### 参考

[A table of two viewports - part one](https://www.quirksmode.org/mobile/viewports.html)

[移动前端开发之viewport的深入了解](https://www.cnblogs.com/2050/p/3877280.html)