https://juejin.im/entry/5937c98eac502e0068cf31ae

`Blob` 对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是JavaScript原生格式的数据。[`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 接口基于`Blob`，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。

要从其他非blob对象和数据构造一个`Blob`，请使用 [`Blob()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/Blob) 构造函数。要创建包含另一个blob数据的子集blob，请使用 [`slice()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/slice)方法

**注意：**

`slice()`方法原本接受`length`作为第二个参数，以表示复制到新`Blob`对象的字节数。如果设置的参数使`start + length`超出了源`Blob`对象的大小，那返回的则是从start到结尾的数据。

## 构造函数

- [`Blob(blobParts[, options\])`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/Blob)

  返回一个新创建的 `Blob` 对象，其内容由参数中给定的数组串联组成。　

## 属性

- [`Blob.size`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/size) 只读

  `Blob` 对象中所包含数据的大小（字节）。

- [`Blob.type`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/type) 只读

  一个字符串，表明该`Blob`对象所包含数据的MIME类型。如果类型未知，则该值为空字符串。

 方法

- [`Blob.slice([start,[ end ,[contentType\]]])`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/slice)

  返回一个新的 `Blob`对象，包含了源 `Blob`对象中指定范围内的数据。

  参数说明：

  start 可选，开始索引,可以为负数,语法类似于数组的slice方法.默认值为0.

  end 可选，结束索引,可以为负数,语法类似于数组的slice方法.默认值为最后一个索引.

  contentType可选 ，新的Blob对象的MIME类型,这个值将会成为新的Blob对象的type属性的值,默认为一个空字符串.

   

## URL.createObjectURL()

URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。

```
objectURL = URL.createObjectURL(blob);
```

使用URL.createObjectURL()函数可以创建一个Blob URL，参数blob是用来创建URL的File对象或者Blob对象，返回值格式是：blob://URL。

> 在每次调用 createObjectURL() 方法时，都会创建一个新的 URL 对象，即使你已经用相同的对象作为参数创建过。当不再需要这些 URL 对象时，每个对象必须通过调用 URL.revokeObjectURL() 方法传入创建的URL为参数，用来释放它。浏览器会在文档退出的时候自动释放它们，但是为了获得最佳性能和内存使用状况，应该在安全的时机主动释放掉它们。

## URL.revokeObjectURL()

URL.revokeObjectURL() 静态方法用来释放一个之前通过调用 URL.createObjectURL() 创建的已经存在的 URL 对象。当你结束使用某个 URL 对象时，应该通过调用这个方法来让浏览器知道不再需要保持这个文件的引用了。

```
window.URL.revokeObjectURL(objectURL);
```

> 参数: objectURL 是一个通过URL.createObjectURL()方法创建的对象URL.

#### blob应用

① 大文件分割上传

```
function upload(blobOrFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };
  xhr.send(blobOrFile);
}

document.querySelector('input[type="file"]').addEventListener('change', function(e) {
  var blob = this.files[0];

  const BYTES_PER_CHUNK = 1024 * 1024; // 1MB chunk sizes.
  const SIZE = blob.size;

  var start = 0;
  var end = BYTES_PER_CHUNK;

  while(start < SIZE) {
    upload(blob.slice(start, end));

    start = end;
    end = start + BYTES_PER_CHUNK;
  }
}, false);

})();
```

② 图片跨域请求，处理跨域问题，参考 [createjs ImageLoader.js](https://link.juejin.im/?target=http%3A%2F%2Fcreatejs.com%2Fdocs%2Fpreloadjs%2Ffiles%2Fpreloadjs_loaders_ImageLoader.js.html%23l37)

③ 隐藏视频源路径

```
var video = document.getElementById('video');
var obj_url = window.URL.createObjectURL(blob);
video.src = obj_url;
video.play()
window.URL.revokeObjectURL(obj_url);
```