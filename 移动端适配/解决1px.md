淘宝解决方案(viewport + rem)

```js
(function () {
    var dpr = window.devicePixelRatio;
    var meta = document.createElement('meta');
    var scale = 1 / dpr;
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, user-scalable=no, initial-scale=' + scale +
      ', maximum-scale=' + scale + ', minimum-scale=' + scale);
    document.getElementsByTagName('head')[0].appendChild(meta);
    // 动态设置的缩放大小会影响布局视口的尺寸
      function resize() {
      var deviceWidth  = document.documentElement.clientWidth;
      document.documentElement.style.fontSize = (deviceWidth / 10) +'px';
         }
    resize();
    window.onresize = resize;
  })()
```

```js
docEl.setAttribute('data-dpr', dpr);
```

```css
[data-dpr=2] div{
    font-size: 32px
}
[data-dpr=3] div{
    font-size: 48px
}
```

```js
 var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
```

**2**:伪类和transform: scale()

原理是把原先元素的 border 去掉，然后利用 `:before` 或者 `:after` 重做 border ，并 transform 的 scale 缩小一半，原先的元素相对定位，新做的 border 绝对定位

**单条border**

```css
.hairlines li{
    position: relative;
    border:none;
}
.hairlines li:after{
    content: '';
    position: absolute;
    left: 0;
    background: #000;
    width: 100%;
    height: 1px;
    -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
}
```

**四条**

```css
.hairlines li{
    position: relative;
    margin-bottom: 20px;
    border:none;
}
.hairlines li:after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #000;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 200%;
    height: 200%;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: left top;
    transform-origin: left top;
}

```

```js
//检查是否是Retain屏,Retina显示屏（英文：Retina Display）是一种由苹果公司设计和委托制造的显示屏，具备足够高像素密度而使得人体肉眼无法分辨其中单独像素点的液晶屏，最初采用该种屏幕的产品iPhone 4由首席执行官史蒂夫·乔布斯于WWDC2010发布，其屏幕分辨率为960×640（每英寸像素数326ppi）。
if(window.devicePixelRatio && devicePixelRatio >= 2){
    document.querySelector('ul').className = 'hairlines';
}
```

**3: box-shadow**

```css
border: none;
box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.5);
```

**4: 背景渐变**

```css
background:
    linear-gradient(180deg, black, black 50%, transparent 50%) top    left  / 100% 1px no-repeat,
    linear-gradient(90deg,  black, black 50%, transparent 50%) top    right / 1px 100% no-repeat,
    linear-gradient(0,      black, black 50%, transparent 50%) bottom right / 100% 1px no-repeat,
    linear-gradient(-90deg, black, black 50%, transparent 50%) bottom left  / 1px 100% no-repeat;
}

```

**5: 图片实现**

```css
border-width: 1px;
border-image: url(border.gif) 2 repeat;
```

