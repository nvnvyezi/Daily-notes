### 基本类型

- number
- string
- null
- undefined
- Symbol
- BigInt
- Boolean

### 引用类型

- object

### 区别

#### 基本类型

- 不可变性
- 存储在栈中
- 值的比较

#### 栈

- 存储的值大小固定
- 空间较小
- 可以直接操作其保存的变量，运行效率高
- 由系统自动分配存储空间

#### 引用类型

- 存储在堆中
- 引用的比较

#### 堆

- 存储的值大小不定，可动态调整
- 空间较大，运行效率低
- 无法直接操作其内部存储，使用引用地址读取
- 通过代码进行分配空间

### 包装类型

- String
- Number
- Boolean

### todo

- `ECMAScript中所有的函数都是按值传递的`
- null转换为数字为0
- undefined转换为数字为NaN