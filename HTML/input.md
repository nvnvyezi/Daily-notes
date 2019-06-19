### input

为基于Web的表单创建交互式控件，以便接受来自用户的数据；

### input属性

- **type**：要呈现的控件类型
- **accept**：当`type="file"`时，表明服务器端可接受的文件类型，值为一个逗号分隔的列表，包含多个唯一的内容类型声明
  - 以 STOP 字符 (U+002E) 开始的文件扩展名。（例如：".jpg,.png,.doc"）
  - 一个有效的MIME类型，但没有拓展名
  - `audio/*`表示音频文件
  - `image/*`表示图片文件
  - `video/*`表示视频文件
- **accesskey**：全局属性，为当前元素绑定一个触发事件的快捷键
- **autocomplete**：表示控件的值是否可以被浏览器自动填充，当`type=hidden,checkbox,radio,file,button,submit,reset,image`时此值失效
- **autofocus**：自动获得焦点，不适用于`type=hidden`，文档中只有一个表单元素可以具有`autofocus`属性
- **autoSave**：当`type=search`时，之前的搜索值将在页面加载的下拉列表中保留
- **disabled**：禁用此控件，提交表单忽略此组件，当`type=hidden`时，此属性将被忽略
- **form**：值是在同一文件中的一个`form`的id，使表单不必一定得作为`form`的后代
- **formaction**：处理提交的表单的url，可以覆盖`action`属性
- **formenctype**：覆盖`enctype`属性
- **formmethod**：覆盖`method`属性
- **formnovalidate**：当`input`是提交按钮或者图片，则此属性指定在提交表单时需不需要验证。覆盖`novalidate`属性
- **formatarget**：指示在提交表单后显示接收响应的位置，将覆盖`target`属性
  - `_self`：缺省值，在当前页面重新加载返回值
  - `_blank`：在新窗口加载返回值
  - `_parent`：在父级浏览上下文中打开，当没有父级，和`_self`一致
  - `_top`：HTML 4文档时清空当前文档，加载返回内容；HTML5时在当前文档的最高级内加载返回值，如果没有父级，和`_self`的行为一致。
  - `iframename`: 返回值在指定frame中加载
- **height**：当`type=image`时定义图片高度
- **width**：当`type=image`时定义图片宽度
- **list**：预定义选项列表，值为同一文档的`datalist`的id，当`type=hidden,checkbox,radio,file`，此属性被忽略
- **max**：数字或者日期的最大值，理论不小于`min`
- **multiple**：当`type=file,email`指示用户能否选择多个值。
- **name**：控件的名称。和值一起被提交
- **pattern**：当`type=text,search,tel,url,email`时检验控件值的正则表达式
- **placeholder**：当`type=text.search,url,email,tel`时指示输入框的作用
- **readonly**：指示用户无法修改控件的值
- **required**：在提交表单前必须先填充值，当`type=hidden,image,reset,submit,button`时忽略
- **selectionDirection**：选择发生的方向
- **size**：控件的初始大小。当`type=text,password`时，表示输入的字符的长度。从HTML5开始，适用于当`type=text, search, tel, url, email,password`。否则会被忽略。 值必须大于0。 缺省值20。浏览器显示不一致
- **spellcheck**：元素需要检查其拼写和语法
- **src**：当`type=image`为图片路径
- **step**：设置数字或日期时间值的增量
- **tabindex**：元素在当前文档的tab导航顺序中的位置
- **value**：控件的值

### type属性

- **button**：无缺省行为按钮
- **checkbox**：复选框，`value`属性定义被选中时的值，也可以使用`indeterminate`指示复选框在不确定状态
- **radio**：单选框，value为选定的值，当在同一个单选按钮组中，所有单选按钮的`name`值相同时，同一时间只能有一个按钮被选中
- **color**：选择颜色的控件
- **date**：日期的控件（年/月/日， 不包括时间）
- **datetime**：已废弃， 使用`datetime-local`代替
- **datetime**-local： 日期时间控件，不包含时区
- **email**：用于输入`e-mail`字段，可以搭配CSS伪类`:valid`和`:invalid`使用
- **file**：用户选择文件，使用`accept`属性定义上传文件的可选择类型 
- **hidden**：页面不显示，但是值会提交到服务器
- **image**：图片提交按钮，使用`src`属性来说明图片来源，使用`alt`来说明图片的信息，也可以使用`width`，`height`来定义图片大小
- **month**：年月控件，不带时区
- **number**：数字控件。输入浮点数可以使用`step`属性来指明几位小数
- **password**：值为`*`的控件，可以使用`maxlength`指定可以输入的值的最大长度
- **range**：不精确值的控件，缺省值为
  - **min**：0
  - **max**： 100
  - **value**：`min+(max-min)/2`，当`max`小于`min`时使用`min`
  - **step**：1
- **reset**：将表单内容设置为缺省值
- **search**：输入搜索字符串的单行文本字段，换行会被从输入的值中自动移除。
- **submit**：提交表单的按钮
- **tel**：输入电话号码的控件，可以使用`pattern`和`maxlength`来约束输入的值
- **text**：缺省值
- **time**：不含时区的时间控件
- **url**：编辑URL的字段，可以使用`pattern`和`maxlength`来约束输入的值
- **week**：星期-年组成的日期，没有时间

#### Notes

1. 可以用 `:valid` 和`:invalid`CSS 伪类来给一个元素指定符合输入和不符合时候的样式。

2. `indeteminate`只能用js来指定
3. 换行会被移除