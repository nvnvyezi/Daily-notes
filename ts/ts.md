Tsc: 编辑器选项：https://www.typescriptlang.org/docs/handbook/compiler-options.html

### 基础类型

对应 JavaScript 动态类型的静态类型：

- `undefined`, `null`
- `boolean`, `number`, `string`
- `symbol`
- `object`
- 注意：值 `undefined` 与类型 `undefined`（取决于所在的位置）

TypeScript 的特定类型：

- `Array`（从技术上讲不是 JS 中的类型）
- `any`（所有值的类型）
- 等等其他类型

> `undefined`作为值和类型都写做 `undefined`。根据使用它的位置，会被解释为值或类型。 `null` 也是如此。
>
> 也可以进行组合的方式创建更多的类型表达式(string | number)
>
> ts通常可以对定义的变量进行推断(const a = 123)，a被推断为number，或者主动进行注释(const a: number = 123)

### 数组类型

列表：所有元素都具有相同的类型，数组的长度各不相同

 两种方式定义数组：

- 在元素类型后面接上[]，`number[]`
- 使用数组泛型，`Array<number>`

元祖：元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同

- 定义一对值分别为string和number类型的元组`[string, number]`
- 当访问一个越界的元素，会使用联合类型替代,(`string|number`)

枚举类型：对JavaScript标准数据类型的一个补充

### any

为那些在编程阶段还不清楚类型的变量指定一个类型

### void

- 某种程度上来说，`void`类型像是与`any`类型相反，它表示没有任何类型
- 只能为它赋予`undefined`和`null`

### Null 和 Undefined

- 默认情况下`null`和`undefined`是所有类型的子类型。 就是说你可以把 `null`和`undefined`赋值给`number`类型的变量。
- 当指定了`--strictNullChecks`标记，`null`和`undefined`只能赋值给`void`和它们各自。

### Never

- 用不存在的值的类型。比如：（`never`类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型）
- `never`类型是任何类型的子类型，也可以赋值给任何类型
- *没有*类型是`never`的子类型或可以赋值给`never`类型（除了`never`本身之外）

### Object

- `object`表示非原始类型，也就是除`number`，`string`，`boolean`，`symbol`，`null`或`undefined`之外的类型。

### 类型断言

- 当明确知道一个实体具有比它现有类型更确切的类型。
-  类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用

**两种形式**

- 尖括号语法： `<string>variable`
- as语法：`variable as string`

### 只读属性

- 只想在对象刚创建的时候修改其值。`readonly T:string`
- `ReadonlyArray<T>`类型，确保数组被创建后不能修改，把数组赋值到普通数组也不可以，可以用类型断言重写，`T = T as number[]`

- 作为变量时使用`const`，属性使用`readonly`

### 额外的属性检查

```ts
interface S {
    color?: string;
    width?: number;
}
greet(a: S): { color: string; area: number } {
    return "Hello, " + this.greeting;
}
greet({ colour: "red", width: 100 })
//对象字面量会被特殊对待而且会经过 额外属性检查，当将它们赋值给变量或作为参数传递的时候。 如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误
```

**解决方法**

- 使用断言`greet({ colour: "red", width: 100 } as S)`

- 添加一个字符串索引签名，前提是你能够确定这个对象可能具有某些做为特殊用途使用的额外属性

  ```ts
  interface S {
      color?: string;
      width?: number;
      [propName: string]: any;
  }
  ```

- 将对象赋值给一个另一个变量，参数使用变量的形式

### 函数类型

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

- 对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配
- 剩余参数，在不确定参数有多少的情况下可以采用(T1: string, …T2: string[] )
- this被报为any类型，
  - 在参数列表最前面`this: void`
  - 或者采用对象的类型`this: T`

### 泛型

**泛型约束**

- 使用extends关键字来实现约束

```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
//只能接受有lenght属性的类型
```

**在泛型约束中使用类型参数**

你可以声明一个类型参数，且它被另一个类型参数所约束。 比如，现在我们想要用属性名从对象里获取这个属性。 并且我们想要确保这个属性存在于对象 `obj`上，因此我们需要在这两个类型之间使用约束。

```ts
function getProperty(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

### 可索引的类型

```ts
interface StringArray {
  [index: number]: string;
}
```

- 可索引类型具有一个 *索引签名*，它描述了对象索引的类型，还有相应的索引返回值类型。 

- TypeScript支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。

  

### 工具泛型

#### Partial

将传入的属性变为可选属性

```typescript
type Partial<T> = { [P in keyof T]?: T[P] };
```

#### Required

将传入的属性变为必选属性

```typescript
type Required<T> = { [P in keyof T]-?: T[P] };
```

#### Mutable

对 `readonly` 进行加减.

```typescript
//移除T上所有属性的readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}
```

#### Readonly

将传入的属性变为只读

```typescript
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

#### Record

将 K 中所有的属性的值转化为 T 类型

```typescript
type Record<K extends keyof any, T> = { [P in K]: T };
```

#### Pick

从 T 中取出 一系列 K 的属性

```typescript
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
```

#### Exclude

Exclude 的作用是从 T 中找出 U 中没有的元素

```typescript
type Exclude<T, U> = T extends U ? never : T;
type T = Exclude<1 | 2, 1 | 3> // -> 2
```

#### Extract

提取出 T 包含在 U 中的元素

```typescript
type Extract<T, U> = T extends U ? T : never;
```

#### Omit

忽略对象某些属性功能,

```typescript
type Omit = Pick<T, Exclude<keyof T, K>>

// 使用
type Foo = Omit<{name: string, age: number}, 'name'> // -> { age: number }
```

#### ReturnType

 `infer`  :在条件类型语句中, 我们可以用 `infer` 声明一个类型变量并且对它进行使用,

```typescript
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any;
//使用
function foo(x: number): Array<number> {
  return [x];
}
type fn = ReturnType<typeof foo>;
```

#### AxiosReturnType

开发经常使用 axios 进行封装 API层 请求, 通常是一个函数返回一个 `AxiosPromise<Resp>`, 现在我想取到它的 Resp 类型, 根据上一个工具泛型的知识我们可以这样写.

```typescript
import { AxiosPromise } from 'axios' // 导入接口
type AxiosReturnType<T> = T extends (...args: any[]) => AxiosPromise<infer R> ? R : any

// 使用
type Resp = AxiosReturnType<Api> // 泛型参数中传入你的 Api 请求函数
```

