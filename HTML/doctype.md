### <!DOCTYPE>

不是 HTML 标签；指示 web 浏览器关于页面使用哪个 HTML 版本进行编写的指令。

在 HTML 4.01 中，<!DOCTYPE> 声明引用 DTD，因为 HTML 4.01 基于 SGML。DTD 规定了标记语言的规则，这样浏览器才能正确地呈现内容。

HTML5不基于SGML，所以不需要引用DTD。

### SGML

标准通用标记语言(Standard Generalized Markup Language)，用于定义通用标准标记语言的文档。

在Web环境当中，HTML4，XHTML以及XML都是以SGML为基础的语言，但是从HTML5开始，HTML有了自己的剖析规则，不在基于SGML

一个SGML文档可能包含三个部分。即SGML声明，Prologue（包含带有各种标记声明的DOCTYPE声明，这些声明一起构成文档类型定义（DTD））和文件实例。

SGML声明定义了文件类型定义和文件实例的语法结构；文件类型定义，定义了文件实例的结构和组成结构的元素类型；文件实例是SGML语言程序的主体部分。 

### DTD

- DTD 规定了使用通用标记语言(SGML)的网页的语法。
- 诸如 HTML 这样的通用标记语言应该使用 DTD 来规定应用于某种特定文档中的标签的规则，这些规则包括一系列的元素和实体的声明。
- 在通用标记语言(SGML)的文档类型声明或 DTD 中，XHTML 被详细地进行了描述。
- XHTML DTD 使用精确的可被计算机读取的语言来描述合法的 XHTML 标记的语法和句法。

**XHTML 1.0 规定了三种 XML 文档类型**：

- STRICT（严格类型）
- TRANSITIONAL（过渡类型）
- FRAMESET（框架类型）

**XHTML 1.0 Strict**

```html
<!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

在此情况下使用：需要干净的标记，避免表现上的混乱。请与层叠样式表配合使用。

**XHTML 1.0 Transitional**

```html
<!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

在此情况下使用：当需要利用 HTML 在表现上的特性时，并且当需要为那些不支持层叠样式表的浏览器编写 XHTML 时。

**XHTML 1.0 Frameset**

```html
<!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```

在此的情况下使用：需要使用HTML框架将浏览器窗口分割为两部分或更多框架时。

### 参考

[DTD简介](http://www.w3school.com.cn/dtd/dtd_intro.asp)

[XHTMLDTD](http://www.w3school.com.cn/xhtml/xhtml_dtd.asp)