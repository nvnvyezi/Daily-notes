我们常说的文档流其实分为定位流、浮动流和普通流三种。而**普通流其实就是指BFC中的FC**。

**FC**是formatting context的首字母缩写，直译过来是格式化上下文，它**是页面中的一块渲染区域**，有一套渲染规则，决定了其**子元素如何布局，以及和其他元素之间的关系和作用。**

常见的FC有BFC、IFC（行级格式化上下文），还有GFC（网格布局格式化上下文）和FFC（自适应格式化上下文），这里就不再展开了。

### **行内块元素与文字的对齐**

既然看到这就先来看看浮动

- **盖不住的文本**
- **浮动元素后面不是块级元素，后面的元素将会和它并排（除非设置了元素的宽度，并且屏幕放不下时将会换行）**
- **浮动元素的上一个元素如果没有浮动，浮动只在当前行浮动；当浮动遇到浮动，它们将在一行排序，除非没有位置了**
- **当元素设置定位值为absolute、fixed时，浮动将被忽略**
- **float引起父元素高度塌陷**
- **浮动元素会被后一个元素的margin-top影响**

[示例](https://segmentfault.com/a/1190000015139923)

浮动的本质：文字环绕图片

`display:inline-block`和`float"left`在某些场合作用是一样的，区别只是ｆｌｏａｔ有方向

**浮动的破坏性**

浮动破坏了正常的`line boxes`

ｏｋ，那ｌｉｎｅｂｏｘｅｓ是个什么东西（懂的同学请绕过）

> CSS 框模型 (Box Model) 规定了元素框处理元素内容、内边距、边框 和 外边距 的方式，我们常见的盒模型大致有两种，一种是块级的盒子（Block Box），一种是行级的盒子（Line Box）

盒子模型是处理盒子本身内部属性，像比如边距，边框的，而视觉格式化模型是来处理这些盒子摆放的

### Block Box

```
display ： block 、 list-item 以及 table 会让一个元素成为块级元素。
```

### Line Box

```
每一行称为一条Line Box，它又是由这一行的许多inline-box组成
display：inline会让一个元素称为行内元素
```

### inline-block

> 将对象呈现为inline对象，但是对象的内容作为block对象呈现。之后的内联对象会被排列在同一行内。比如我们可以给一个link（a元素）inline-block属性值，使其既具有block的宽度高度特性又具有inline的同行特性。

# Formatting context

> 每个元素，或者说每个Box会根据设置的display值，去选择渲染它的方式，不同的display有不同层级：block-level box（块级）inline-level box(行级)，run-in box(插入型框 css3)，不同的层级会参与不同的环境（formatting context）去渲染

#### 视觉格式化模型

CSS 视觉格式化模型（*visual formatting model）*是用来处理和在视觉媒体上显示文档时使用的计算规则。该模型是 CSS 的基础概念之一。

视觉格式化模型会根据[CSS盒子模型](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)将文档中的元素转换为一个个盒子，每个盒子的布局由以下因素决定：

- 盒子的尺寸：精确指定、由约束条件指定或没有指定
- 盒子的类型：行内盒子（inline）、行内级盒子（inline-level）、原子行内级盒子（atomic inline-level）、块盒子（block）
- [定位方案（positioning scheme）](https://developer.mozilla.org/zh-CN/docs/CSS/Box_positioning_scheme)：普通流定位、浮动定位或绝对定位
- 文档树中的其它元素：即当前盒子的子元素或兄弟元素
- [视口](https://developer.mozilla.org/en-US/docs/Glossary/viewport)尺寸与位置
- 所包含的图片的尺寸
- 其他的某些外部因素

该模型会根据盒子的包含块（*containing block）的*边界来渲染盒子。通常，盒子会创建一个包含其后代元素的包含块，但是盒子并不由包含块所限制，当盒子的布局跑到包含块的外面时称为溢出（*overflow）*。

> **块**：block，一个抽象的概念，一个块在文档流上占据一个独立的区域，块与块之间在垂直方向上按照顺序依次堆叠。
>
> **包含块**：containing block，包含其他盒子的块称为包含块。
>
> **盒子**：box，一个抽象的概念，由CSS引擎根据文档中的内容所创建，主要用于文档元素的定位、布局和格式化等用途。盒子与元素并不是一一对应的，有时多个元素会合并生成一个盒子，有时一个元素会生成多个盒子（如匿名盒子）。
>
> **块级元素**：block-level element，元素的 `display` 为 `block`、`list-item`、`table` 时，该元素将成为块级元素。元素是否是块级元素仅是元素本身的属性，并不直接用于格式化上下文的创建或布局。
>
> **块级盒子**：block-level box，由块级元素生成。一个块级元素至少会生成一个块级盒子，但也有可能生成多个（例如列表项元素）。
>
> **块盒子**：block box，如果一个块级盒子同时也是一个块容器盒子（见下），则称其为块盒子。除具名块盒子之外，还有一类块盒子是匿名的，称为匿名块盒子（Anonymous block box），匿名盒子无法被CSS选择符选中。
>
> **块容器盒子**：block container box或block containing box，块容器盒子侧重于当前盒子作为“容器”的这一角色，它不参与当前块的布局和定位，它所描述的仅仅是当前盒子与其后代之间的关系。换句话说，块容器盒子主要用于确定其子元素的定位、布局等。
>
> **行内级元素**：inline-level element，`display` 为 `inline`、`inline-block`、`inline-table` 的元素称为行内级元素。与块级元素一样，元素是否是行内级元素仅是元素本身的属性，并不直接用于格式化上下文的创建或布局。
>
> **行内级盒子**：inline-level box，由行内级元素生成。行内级盒子包括行内盒子和原子行内级盒子两种，区别在于该盒子是否参与行内格式化上下文的创建。
>
> **行内盒子**：inline box，参与行内格式化上下文创建的行内级盒子称为行内盒子。与块盒子类似，行内盒子也分为具名行内盒子和匿名行内盒子（anonymous inline box）两种。
>
> **原子行内级盒子**：atomic inline-level box，不参与行内格式化上下文创建的行内级盒子。原子行内级盒子一开始叫做原子行内盒子（atomic inline box），后被修正。原子行内级盒子的内容不会拆分成多行显示。

**快级元素**

块状元素排斥其他元素与其位于同一行，可以设定元素的宽（width）和高（height），块级元素一般是其他元素的容器，可容纳块级元素和行内元素

```
 1 <address>//定义地址
 2 <caption>//定义表格标题
 3 <dd>    //定义列表中定义条目
 4 <div>     //定义文档中的分区或节
 5 <dl>    //定义列表
 6 <dt>     //定义列表中的项目
 7 <fieldset> //定义一个框架集
 8 <form> //创建 HTML 表单
 9 <h1>    //定义最大的标题
10 <h2>    // 定义副标题
11 <h3>     //定义标题
12 <h4>     //定义标题
13 <h5>     //定义标题
14 <h6>     //定义最小的标题
15 <hr>     //创建一条水平线
16 <legend>    //元素为 fieldset 元素定义标题
17 <li>     //标签定义列表项目
18 <noframes>    //为那些不支持框架的浏览器显示文本，于 frameset 元素内部
19 <noscript>    //定义在脚本未被执行时的替代内容
20 <ol>     //定义有序列表
21 <ul>    //定义无序列表
22 <p>     //标签定义段落
23 <pre>     //定义预格式化的文本
24 <table>     //标签定义 HTML 表格
25 <tbody>     //标签表格主体（正文）
26 <td>    //表格中的标准单元格
27 <tfoot>     //定义表格的页脚（脚注或表注）
28 <th>    //定义表头单元格
29 <thead>    //标签定义表格的表头
30 <tr>     //定义表格中的行
```

**行内元素**

行内元素不可以设置宽（width）和高（height），但可以与其他行内元素位于同一行，行内元素内一般不可以包含块级元素。行内元素的高度一般由元素内部的字体大小决定，宽度由内容的长度控制。

```
 1 <a>     //标签可定义锚
 2 <abbr>     //表示一个缩写形式
 3 <acronym>     //定义只取首字母缩写
 4 <b>     //字体加粗
 5 <bdo>     //可覆盖默认的文本方向
 6 <big>     //大号字体加粗
 7 <br>     //换行
 8 <cite>     //引用进行定义
 9 <code>    // 定义计算机代码文本
10 <dfn>     //定义一个定义项目
11 <em>     //定义为强调的内容
12 <i>     //斜体文本效果
13 <img>     //向网页中嵌入一幅图像
14 <input>     //输入框
15 <kbd>     //定义键盘文本
16 <label>     //标签为 input 元素定义标注（标记）
17 <q>     //定义短的引用
18 <samp>     //定义样本文本
19 <select> // 创建单选或多选菜单
20 <small>     //呈现小号字体效果
21 <span>     //组合文档中的行内元素
22 <strong> //加粗
23 <sub>     //定义下标文本
24 <sup>     //定义上标文本
25 <textarea>     //多行的文本输入控件
26 <tt>     //打字机或者等宽的文本效果
27 <var>    // 定义变量
```

**可变元素**

根据上下文语境决定转为块级元素还是行内元素。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
1 <button>     //按钮
2 <del>    // 定义文档中已被删除的文本
3 <iframe>     //创建包含另外一个文档的内联框架（即行内框架）
4 <ins>     //标签定义已经被插入文档中的文本
5 <map>     //客户端图像映射（即热区）
6 <object>     //object对象
7 <script>     //客户端脚本
```

块级元素和行内元素区别

1. 行内元素同一行水平排列。
2. 块级元素各占据一行，垂直方向排列。
3. 块级元素可以包含行内元素和块级元素。但行内元素不能包含块级元素。
4. 行内元素与块级元素属性的不同，主要是盒模型属性上。
5. 行内元素设置width无效，height无效(可以设置line-height)，margin上下无效，padding上下无效

可以通过修改样式display属性改变元素是以块级还是行内元素呈现，当display的值设为block时，元素将以块级方式呈现；当display值设为inline时，元素将以行内形式呈现。

如果想让一个元素可以设置宽度高度，又让它以行内形式显示，我们可以设置display的值为inline-block。

**快级元素与快盒子**

当元素的 [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `block`、`list-item` 或 `table` 时，该元素将成为块级元素。一个块级元素会被格式化成一个块（例如文章的一个段落），默认按照垂直方向依次排列。

每个块级盒子都会参与[块格式化上下文（block formatting context）](https://developer.mozilla.org/en-US/docs/CSS/block_formatting_context)的创建，而每个块级元素都会至少生成一个块级盒子，即主块级盒子（*principal block-level* *box）。有*一些元素，比如列表项会生成额外的盒子来放置项目符号，而那些会生成列表项的元素可能会生成更多的盒子。不过，多数元素只生成一个主块级盒子。 

 主块级盒子包含由后代元素生成的盒子以及内容，同时它也会参与[定位方案](https://developer.mozilla.org/zh-CN/docs/CSS/Positioning_scheme)。

![venn_blocks.png](https://developer.mozilla.org/@api/deki/files/5995/=venn_blocks.png)一个块级盒子可能也是一个块容器盒子。块容器盒子（*block container box）要么*只包含其它块级盒子，要么只包含行内盒子并同时创建一个行内[格式化上下文（inline formatting context）](https://developer.mozilla.org/en-US/docs/CSS/Inline_formatting_context)。

能够注意到块级盒子与块容器盒子是不同的这一点很重要。前者描述了元素与其父元素和兄弟元素之间的行为，而后者描述了元素跟其后代之间的行为。有些块级盒子并不是块容器盒子，比如表格；而有些块容器盒子也不是块级盒子，比如非替换行内块和非替换表格单元格。

一个同时是块容器盒子的块级盒子称为块盒子（*block box）。*

#### 匿名块盒子

在某些情况下进行视觉格式化时，需要添加一些增补性的盒子，这些盒子不能用CSS选择符选中，因此称为匿名盒子（*anonymous boxes）*。

不能被 CSS 选择符选中意味着不能用样式表添加样式，也就是说，此时所有可继承的 CSS 属性值都为 `inherit` ，而所有不可继承的 CSS 属性值都为 `initial`。

块包含盒子可能只包含行内级盒子，也可能只包含块级盒子，但通常的文档都会同时包含两者，在这种情况下，就会在相邻的行内级盒子外创建匿名块盒子。

### 行内级元素和行内盒子

如果一个元素的 [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 属性为 `inline`、`inline-block` 或 `inline-table`，则称该元素为行内级元素。显示时，它不会生成内容块，但是可以与其他行内级内容一起显示为多行。一个典型的例子是包含多种格式内容（如强调文本、图片等）的段落，就可以由行内级元素组成。

行内级元素会生成行内级盒子，该盒子同时会参与行内格式化上下文（[inline formatting context](https://developer.mozilla.org/zh-CN/docs/CSS/Inline_formatting_context)）的创建。行内盒子既是行内级盒子，也是一个其内容会参与创建其容器的行内格式化上下文的盒子，比如所有具有 `display:inline` 样式的非替换盒子。如果一个行内级盒子的内容不参与行内格式化上下文的创建，则称其为原子行内级盒子。而通过替换行内级元素或 `display` 值为 `inline-block` 或 `inline-table` 的元素创建的盒子不会像行内盒子一样可以被拆分为多个盒子。

#### 匿名行内盒子

类似于块盒子，CSS引擎有时候也会自动创建一些行内盒子。这些行内盒子无法被选择符选中，因此是匿名的，它们从父元素那里继承那些可继承的属性，其他属性保持默认值 `initial`。 

一种常见的情况是CSS引擎会自动为直接包含在块盒子中的文本创建一个行内格式化上下文，在这种情况下，这些文本会被一个足够大的匿名行内盒子所包含。但是如果仅包含空格则有可能不会生成匿名行内盒子，因为空格有可能会由于 [`white-space`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space) 的设置而被移除，从而导致最终的实际内容为空。

#### 行盒子

行盒子由行内格式化上下文创建，用来显示一行文本。在块盒子内部，行盒子总是从块盒子的一边延伸到另一边（译注：即占据整个块盒子的宽度）。当有浮动元素时，行盒子会从向左浮动的元素的右边缘延伸到向右浮动的元素的左边缘。

行盒子更多是以技术性目的而存在的，Web开发者通常不需要关心。

#### Run-in 盒子

Run-in 盒子通过 `display:run-in` 来定义，它可以是块盒子，也可以是行内盒子，这取决于紧随其后的盒子的类型。Run-in 盒子可以用来在可能的情况下将标题嵌入文章的第一个段落中。

#### 定位规则

一旦生成了盒子以后，CSS引擎就需要定位它们以完成布局。下面是定位盒子时所使用的规则：

- 普通流：按照次序依次定位每个盒子
- 浮动：将盒子从普通流中单独拎出来，将其放到外层盒子的某一边
- 绝对定位：按照绝对位置来定位盒子，其位置根据盒子的包含元素所建立的绝对坐标系来计算，因此绝对定位元素有可能会覆盖其他元素

### 普通流

在普通流中，盒子会依次放置。在块格式化上下文中，盒子在垂直方向依次排列；而在行内格式化上下文中，盒子则水平排列。当CSS的 [`position`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position) 属性为 `static` 或 `relative`，并且 [`float`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float) 为 `none` 时，其布局方式为普通流。

### 浮动

在浮动定位中，浮动盒子会浮动到当前行的开始或尾部位置。这会导致普通流中的文本及其他内容会“流”到浮动盒子的边缘处，除非元素通过 [`clear`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear) 清除了前面的浮动。

一个盒子的 [`float`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float) 值不为 `none`，并且其 [`position`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position) 为 `static` 或 `relative` 时，该盒子为浮动定位。如果将 [`float`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float) 设置为 `left`，浮动盒子会定位到当前行盒子的开始位置（左侧），如果设置为 `right`，浮动盒子会定位到当前行盒子的尾部位置（右侧）。不管是左浮动还是右浮动，行盒子都会伸缩以适应浮动盒子的大小。

### 绝对定位

在绝对定位中，盒子会完全从当前流中移除，并且不会再与其有任何联系（译注：此处仅指定位和位置计算，而绝对定位的元素在文档树中仍然与其他元素有父子或兄弟等关系），其位置会使用 [`top`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/top)、[`bottom`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/bottom)、[`left`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/left) 和 [`right`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/right) 相对其[包含块](https://developer.mozilla.org/zh-CN/docs/Web/CSS/All_About_The_Containing_Block)进行计算。

如果元素的 [`position`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position) 为 `absolute` 或 `fixed`，该元素为绝对定位。

对固定位置的元素来说，其包含块为整个视口，该元素相对视口进行绝对定位，因此滚动时元素的位置并不会改变。

### 元素框

> css假设每个元素都会生成一个或者多个Box，称为元素框，元素框中心有内容区，内容区外周围包括了padding，border，margin，盒模型就是用来处理这些内容的一个模型

### 包含块

> 每个元素都是相对于包含块摆放，包含块就是一个元素的“布局上下文”,

```
<body>
    <div><p>p的包含块是div</p><div>
    //div的包含块是body
</body>
```

### 替换/非替换元素

> 替换元素就是浏览器根据元素的标签和属性，来决定元素的具体显示内容。
> 通过 CSS content 属性来插入的对象 被称作 匿名可替换元素
> 如果元素的内容包含在文档之中，则为非替换元素
> 非替换元素的所有规则同样适用于替换元素，只有一个例外，width如果是auto,元素的高宽就是内容的固有高宽，比如img就是图片的原始大

看完一些常用名词再详细理解一下

**ｂｌｏｃｋ　ｂｏｘ**

![å¾çæè¿°](https://segmentfault.com/img/bVvH4u)



**水平格式化**

计算宽度

正常流中，块级元素框的水平部分 = `其父元素的width` = margin-left+margin-right + padding-left+padding-right+ border-left+border-right+自身width

- 在padding-left/right,margin-left/right,border-left/right,width（我们简称下水平7大属性）中只有margin和width的值可能为auto
- 当margin-left/right，width三个值均设置有固定宽度的时候，margin-right会根据包含块的width自动补齐
- 利用margin：0 auto 居中 所以，利用这种方式居中的时候，必须是要设置居中元素的宽度，这样左右margin的值便会相等，从而引起的居中，这个和text-align：center只能块级元素的内联内容设置居中是不一样的。

**垂直格式化**

height与width一样，height定义了内容区的高度，而不是元素框的高度。元素框上下的内边距，边距，都会增加到height值里。

只有三个属性可以设置auto，height，和margin-top/bottom。注意！这里如果margin-top和margin-bottom同时设置为auto，也不会垂直居中，而是**默认为零**。

垂直格式化，有一个很重要的方面是会造成垂直相邻外边距合并，

**负ｍａｒｇｉｎ**

水平方向

```
若width不是固定值，那么width的值则会增大
因为要满足条件等于父元素width，负margin相当于负值，width auto自动增大
若width为固定值，那么margin-right则会auto增大来满足这个条件
```

![clipboard.png](https://segmentfault.com/img/bVvJai)灰色部分是body内的一个盒子，图二，没有定框使用负margin后，发生偏移，并且宽度增加，图三，定宽，发生偏移但是，宽度不增加，我们常常会发现出现莫名的水平滚动条，这里很有可能就是margin这小子在作祟

垂直方向

![clipboard.png](https://segmentfault.com/img/bVvJev)

黑色是接在灰色div后的一个div,可以看到，margin-bottom为负值，不会造成元素本身的移动，而是造成兄弟元素往上移动，就像我不动，拉了下面的人一把，而margin-top为负值，就像我们排成一队，然后像兔子跳一样一起往前面跳了一步。

从图二也可以看出来，黑色盒子对灰色盒子发生了覆盖，因为浏览器总是按从前到后的顺序显示元素，所以文档中后出现的正常流元素可能会覆盖较早出现的元素。

可以发现，灰色盒子的高度依旧保持着并且渲染出来了，但是CSS读取的高度已经减小，下面的元素自然往上移动了

#### line Box

每一行称为一条Line Box，它又是由这一行的许多inline-box组成，它的高度可以直接由line-height决定，line boxes的高度垂直堆叠形成了containing box的高度，就是我们见到的div或是p标签之类的高度了。

## 基础概念

### 匿名文本

```
<div>当你只有一把锤子<span>一切看起来</span>都像是颗钉子</div>
```

```
未包含在行内元素的字符串（当你只有一把锤子，都像颗钉子）就叫匿名文本
```

### 内容区 行内框 间距

![clipboard.png](https://segmentfault.com/img/bVvMvz)

**内容区**
css假设每个元素都会生成一个或者多个Box，称为元素框，元素框中心有内容区，内容区外周围包括了padding，border，margin，但是，替换元素是包括外边距，内边距，边框的。
**行间距**
行间距是font-size与line-height的差值，被分成两半在内容区的上下
**行内框**
非替换元素，行内框高度=line-height
替换元素，行内框高度=内容区宽度（行间距不应用到替换元素）
**行高**
两行文字基线的距离
**行框**
一行有很多行内框，行框是包含这一行行内框最高点和最低点的
**基线**
不同元素的基线位置不同，整个行框会有一个基线，行内元素的位置是基于两者基线对齐vertical-align(垂直对齐)

> 该属性 定义 行内元素的基线相对于该元素所在行的基线的垂直对齐的方式。
> 只有一个元素属于inline或是inline-block（table-cell也可以理解为inline-block水平）水平，其身上的vertical-align属性才会起作用.
> 同时也可以知道，改变其，会影响到行内框的位置，从而会影响到一整行行内元素的位置

需要注意vertical-align为数值时，会让文字上下移动，当其为百分比时是针对line-height的百分比

```
{
  line-height: 30px;
  vertical-align: -10%;
}
```

实际上，等同于：

```
{
  line-height: 30px;
  vertical-align: -3px;    /* = 30px * -10% */  
}
```

想看vertical-align 和line-hright[关系请戳](https://www.zhangxinxu.com/wordpress/2015/08/css-deep-understand-vertical-align-and-line-height/)https://www.zhangxinxu.com/wordpress/2015/08/css-deep-understand-vertical-align-and-line-height

好的，言归正传，回到正题

**浮动破坏了正常的line boxes**。

默认情况下，图片与文字混排应该是这个样子：图片与文字基线对齐，图片与文字在同一行上，如下图所示： ![默认图文line boxes示意 >> 张鑫旭-鑫空间-鑫生活](https://image.zhangxinxu.com/image/blog/201001/2010-01-20_230801.png) 上图中，图片为一个inline boxes，两边的文字也是inline boxes。由于line boxes的高度是由其内部最高的inline boxes的高度决定的，所以这里line boxes的高度就是图片的高度。此时图片与文字是同一box类型的元素（都是inline boxes），是在同一行上的，所以，默认状态下，一张图片只能与一行文字对齐。而要想让一张图片要与多行文字对齐，您唯一能做的就是破坏正常的line boxes模型。

而添加了浮动

![æµ®å¨å¾æå¸å± >> å¼ é«æ­-é«ç©ºé´-é«çæ´»](http://image.zhangxinxu.com/image/blog/201001/2010-01-20_234149.png)

图片的inline boxes不存在了，图片失去了inline boxes特性就无法与inline boxes的文字排在一行了，其会从line boxes上脱离出来，跟随自身的方位属性，靠边排列。

## user-select

`user-select`属性可以设置元素是否可以被选中, 如果不能被选中, 当然就不可能被复制粘贴了

要注意的是两点:

- 一定要写浏览器前缀, 没有前缀的连Chrome52都无法生效
- 设置一段文本的值为`none`时, 连同文本的周围的元素也一起选中并复制的话, Webkit内核的浏览器会把禁止选中的文本也复制过来, Firefox则没有这种近乎bug的表现

## pointer-events

最重要的是`pointer-events: none`时表现

这会阻止元素的默鼠标行为, 表现为:

- 有href属性的a元素将无法跳转
- css的:hover属性无效
- js的click事件无效

另外, 元素本身会达到”虚化”效果, 使得鼠标可以点击被遮盖的元素

**看一些outline的妙用**

万万不可在全局设置outline: 0 none;

 让普通元素代替表单控件元素有outline效果

outline是一个真正意义上不占任何空间的属性![img](https://user-gold-cdn.xitu.io/2018/7/9/1647c78e4a967dcb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

用一个大大的outline来实现周围半透明的黑色遮罩，因为outline无论设置多么多么大，都不会占据空间影响布局，至于超出的部分，直接给父元素设置一个overflow:hidden就搞定了 注意：

- 因为考虑到IE8不支持rgba，所以上面借助了filter设置了透明度为一半效果
- 但是由于IE9支持rgba，再借助:root来进行重置，不使用filter
- 再加上IE10针对镂空元素会有点击穿透问题，所以再给background设置看不见的背景内容就可以解决

 开发中很多时候，由于页面内容不够多，导致底部footer会出现尴尬的剩余空间，解决方法往往也有很多种，在此我们还是依然利用outline的功能来完美实现一下

关键的css就是设置**一个超大轮廓范围的outline**属性，如给个9999px，保证无论屏幕多高，轮廓颜色都能覆盖

值得注意的是，outline无法指定方位，它是直接向四周发散的，所以需要配合clip剪裁来进行处理,以左边和上边为边界进行裁剪

