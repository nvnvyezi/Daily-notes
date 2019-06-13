### 概念

`Entry`：指定 webpack 开始构建的入口模块，从该模块开始构建并计算出直接或间接依赖的模块或者库

`Output`：告诉 webpack 如何命名输出的文件以及输出的目录

`Loaders`：由于 webpack 只能处理 javascript，所以我们需要对一些非 js 文件处理成 webpack 能够处理的模块，比如 sass 文件

`Plugins`：`Loaders`将各类型的文件处理成 webpack 能够处理的模块，`plugins`有着很强的能力。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。但也是最复杂的一个。比如对 js 文件进行压缩优化的`UglifyJsPlugin`插件

`Chunk`：coding split 的产物，我们可以对一些代码打包成一个单独的 chunk，比如某些公共模块，去重，更好的利用缓存。或者按需加载某些功能模块，优化加载时间。在 webpack3 及以前我们都利用`CommonsChunkPlugin`将一些公共代码分割成一个 chunk，实现单独加载。在 webpack4 中`CommonsChunkPlugin`被废弃，使用`SplitChunksPlugin`

### webpack 启动参数

- color 输出结果带彩色，比如：会用红色显示耗时较长的步骤
- profile 输出性能数据，可以看到每一步的耗时
- progress 输出当前编译的进度，以百分比的形式呈现
- display-modules 默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块
- display-error-details 输出详细的错误信息

### webpack4 特性

- Webpack4 需要与 webpack-cli 一起使用
- 新添了 mode 属性，
  - development
    - Process.env.NODE_ENV = development，需在启动时设置 NODE_ENV=development，否则在编译过程中取不到该值
    - 默认开启以下插件，利用持久化缓存
    - `namedChunksPlugin`：以名称固化 chunk id,
    - `namemodulesPlugin`：以名称固化 module id
  - production
    - Process.env.NODE_ENV = production，同样需配置
    - 默认开启以下插件
    - `SideEffectsFlagPlugin` 和 `UglifyJsPlugin` 用于 tree-shaking
    - `FlagDependencyUsagePlugin` ：编译时标记依赖
    - `FlagIncludedChunksPlugin` ：标记子 chunks，防子 chunks 多次加载
    - `ModuleConcatenationPlugin` ：作用域提升(scope hosting),预编译功能,提升或者预编译所有模块到一个闭包中，提升代码在浏览器中的执行速度
    - `NoEmitOnErrorsPlugin` ：在输出阶段时，遇到编译错误跳过
    - `OccurrenceOrderPlugin` ：给经常使用的 ids 更短的值
    - `SideEffectsFlagPlugin` ：识别 package.json 或者 module.rules 的 sideEffects 标志（纯的 ES2015 模块)，安全地删除未用到的 export 导出
    - `UglifyJsPlugin` ：删除未引用代码，并压缩
- 移除 `CommonsChunkPlugin`插件，取而代之的是两个新的配置项（optimization.splitChunks 和 optimization.runtimeChunk）
- `module.loaders` 替换为 `modules.rules`
- webpack4 增加了 WebAssembly 的支持，可以直接 import/export wasm 模块，也可以通过编写 loaders 直接 import C++/C/Rust

### splitChunks

可以参考https://segmentfault.com/a/1190000013476837

#### extra-text-webpack-plugin

关于`[hash]`和`[chunkhash]`的区别，简单来说，`[hash]`是编译（compilation）后的 hash 值，`compilation`对象代表某个版本的资源对应的编译进程。项目中任何一个文件改动，webpack 就会重新创建`compilation`对象，然后计算新的 compilation 的 hash 值，所有的编译输出文件名都会使用相同的 hash 指纹，改一个就一起变。而`[chunkhash]`是根据具体模块文件的内容计算所得的 hash 值，某个文件的改动只会影响它本身的 hash 指纹，不会影响其他文件。

### hash/chunkhash:

`hash`：在 webpack 一次构建中会产生一个 compilation 对象，该 hash 值是对 compilation 内所有的内容计算而来的

> 与整个项目的构建有关。只要整个项目中有文件更改，就会产生新的 hash 值，并且所有的文件共用一个 hash 值。
>
> hash 一般是结合 CDN 缓存来使用，通过 webpack 构建之后，生成对应文件名自动带上对应的 MD5 值。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的 HTML 引用的 URL 地址也会改变，触发 CDN 服务器从源服务器上拉取对应数据，进而更新本地缓存。但是在实际使用的时候，这几种 hash 计算还是有一定区别。
>
> compiler 对象代表的是配置完备的 Webpack 环境。 compiler 对象只在 Webpack 启动时构建一次，由 Webpack 组合所有的配置项构建生成。
>
> compilation 对象代表某个版本的资源对应的编译进程。当使用 Webpack 的 development 中间件时，每次检测到项目文件有改动就会创建一个 compilation，进而能够针对改动生产全新的编译文件。compilation 对象包含当前模块资源、待编译文件、有改动的文件和监听依赖的所有信息。
>
> compiler 代表配置好的 webpack 环境，compilation 针对随时可变得项目文件，只要文件有改动就会重新创建。

`chunkhash`：每一个 chunk 都根据自身的内容计算而来。

> 根据不同的 entry 进行文件依赖分析，构建对应的 chunk，生成对应的 hash 值，即可以将一些公共库单独打包构建，只要不改动公共库的代码，生成的 hash 值就不变。
>
> 保证了在线上构建的时候只要文件内容没有更改就不会重复构建

`contenthash`：在 js 中引用 css 时，保证 css 不变的情况下 hash 值不变

https://juejin.im/post/5a4502be6fb9a0450d1162ed

分析 webpack 中的 Compiler/Compilation/Stats 对象及构建顺序：https://github.com/liangklfangl/webpack-compiler-and-compilation

### tsconfig.json

**概述**

如果一个目录下存在一个`tsconfig.json`文件，那么它意味着这个目录是 TypeScript 项目的根目录。`tsconfig.json`文件中指定了用来编译这个项目的根文件和编译选项。 一个项目可以通过以下方式之一来编译：

**使用 tsconfig.json**

- 不带任何输入文件的情况下调用`tsc`，编译器会从当前目录开始去查找`tsconfig.json`文件，逐级向上搜索父目录。
- 不带任何输入文件的情况下调用`tsc`，且使用命令行参数`--project`（或`-p`）指定一个包含`tsconfig.json`文件的目录。

当命令行上指定了输入文件时，`tsconfig.json`文件会被忽略

**配置示例**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true
  },
  "files": ["app.ts", "foo.ts"],
  // 或者使用include,exclude指定待编译文件
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

`compilerOptions` 用来配置编译选项，`files` 用来指定待编译文件。

这里的待编译文件是指**入口文件**，任何被入口文件依赖的文件

`files` 属性是一个数组，数组元素可以是相对文件路径和绝对文件路径。

`include` 和 `exclude` 属性也是一个数组，但数组元素是类似 `glob` 的文件模式。它支持的 `glob` 通配符包括：

- `*` ：匹配 0 或多个字符（注意：不含路径分隔符）
- `?` ：匹配任意单个字符（注意：不含路径分隔符）
- `**/` ：递归匹配任何子路径

TS 文件指拓展名为 `.ts`、`.tsx` 或 `.d.ts` 的文件。如果开启了 `allowJs` 选项，那 `.js` 和 `.jsx` 文件也属于 TS 文件。

如果仅仅包含一个 `*` 或者 `.*` ，那么只有**TS 文件**才会被包含。

如果 `files` 和 `include` 都未设置，那么除了 `exclude` 排除的文件，编译器会默认包含路径下的所有 **TS 文件**。

如果同时设置 `files` 和 `include` ，那么编译器会把两者指定的文件都引入。

如果未设置 `exclude` ，那其默认值为 `node_modules` 、`bower_components`、`jspm_packages` 和编译选项 `outDir` 指定的路径。

`exclude` 只对 `include` 有效，对 `files` 无效。即 `files` 指定的文件如果同时被 `exclude` 排除，那么该文件仍然会被编译器引入。

前面提到，任何被 `files` 或 `include` 引入的文件的依赖会被自动引入。
反过来，如果 `B.ts` 被 `A.ts` 依赖，那么 `B.ts` 不能被 `exclude` 排除，除非 `A.ts` 也被排除了。

有一点要注意的是，编译器不会引入疑似为输出的文件。比如，如果引入的文件中包含 `index.ts` ，那么 `index.d.ts` 和 `index.js` 就会被排除。通常来说，只有拓展名不一样的文件命名法是不推荐的。

`tsconfig.json` 也可以为空文件，这种情况下会使用默认的编译选项来编译所有默认引入的文件。

官方编译选项列表：https://www.tslang.cn/docs/handbook/compiler-options.html

可以参考：https://www.tslang.cn/docs/handbook/tsconfig-json.html

### tslint/eslint 选择

https://ts.xcatliu.com/engineering/lint.html

Eslint 规则:http://eslint.cn/docs/user-guide/configuring

参考掘金的 eslint；https://juejin.im/post/5b3859a36fb9a00e4d53fc85

react 配置 eslint 一些规则： https://segmentfault.com/a/1190000013062992

##### eslint 配置项

- root 限定配置文件的使用范围
- parser 指定 eslint 的解析器
- parserOptions 设置解析器选项
- extends 指定 eslint 规范
- plugins 引用第三方的插件
- env 指定代码运行的宿主环境
- rules 启用额外的规则或覆盖默认的规则
- globals 声明在代码中的自定义全局变量

### git 提交检测/husky/pre-commit/lint-staged

husky 继承了 Git 下所有的钩子，在触发钩子的时候，husky 可以阻止不合法的 commit,push 等等。

husky 是一个 npm 包，安装后，可以很方便的在`package.json`配置`git hook` 脚本 。

比如，在 package.json 内配置如

```json
 "scripts": {
    "lint": "eslint src"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint"
    }
  },
```

那么，在后续的每一次`git commit` 之前，都会执行一次对应的 hook 脚本`npm run lint` 。其他 hook 同理

pre-commit：https://github.com/PaicFE/blog/issues/10

lint-staged: https://github.com/okonet/lint-staged

### prettire 配置

https://prettier.io/docs/en/options.html

### 优化

1. include & exclude

2. babel-loader

- `cacheDirectory`：默认值为 `false`。当有设置时，指定的目录将用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程(recompilation process)。如果设置了一个空值 (`loader: 'babel-loader?cacheDirectory'`) 或者 `true` (`loader: babel-loader?cacheDirectory=true`)，loader 将使用默认的缓存目录 `node_modules/.cache/babel-loader`，如果在任何根目录下都没有找到 `node_modules` 目录，将会降级回退到操作系统默认的临时文件目录。

3. 引入 babel runtime，避免重复引入
4. `resolve.modules`解析时搜索的目录
5. `resolve.mainFields`用于配置第三方模块使用那个入口文件

> 安装的第三方模块中都会有一个 package.json 文件,用于描述这个模块的属性，其中有些字段用于描述入口文件在哪里，resolve.mainFields 用于配置采用哪个字段作为入口文件的描述。
>
> 可以存在多个字段描述入口文件的原因是因为有些模块可以同时用在多个环境中，针对不同的运行环境需要使用不同的代码。 以 isomorphic-fetch API 为例，它是 Promise 的一个实现，但可同时用于浏览器和 Node.js 环境。

6. `resolve.alias`配置项通过别名来把原导入路径映射成一个新的导入路径

7. `resolve.extensions`在导入语句没带文件后缀时，webpack 自动带上后缀去尝试查询文件是否存在

   1. 后缀列表尽可能小
   2. 频率最高的往前方
   3. 导出语句里尽可能带上后缀

8. `module.noParse`让 webpack 忽略对部分没采用模块化的文件的递归解析处理

   1. 被忽略掉的文件里不应该包含 import 、 require 、 define 等模块化语句

9. 使用动态链接库

   1. `webapck.DllPlugin`
      1. `context` (optional): manifest 文件中请求的上下文(context)(默认值为 webpack 的上下文(context))
      2. `name`: 暴露出的 DLL 的函数名 ([TemplatePaths](https://github.com/webpack/webpack/blob/master/lib/TemplatedPathPlugin.js): `[hash]` & `[name]` )
      3. `path`: manifest json 文件的**绝对路径** (输出文件)`
   2. `webpack.DllReferencePlugin`
      1. `context`: (**绝对路径**) manifest (或者是内容属性)中请求的上下文
      2. `manifest`: 包含 `content` 和 `name` 的对象，或者在编译时(compilation)的一个用于加载的 JSON manifest 绝对路径
      3. `content` (optional): 请求到模块 id 的映射 (默认值为 `manifest.content`)
      4. `name` (optional): dll 暴露的地方的名称 (默认值为 `manifest.name`) (可参考 [`externals`](https://webpack.docschina.org/configuration/externals/))
      5. `scope` (optional): dll 中内容的前缀
      6. `sourceType` (optional): dll 是如何暴露的 ([libraryTarget](https://webpack.docschina.org/configuration/output/#output-librarytarget))
   3. `libraryTarget` 和 `library`
      1. output.libraryTarget 配置以何种方式导出库。
      2. output.library 配置导出库的名称。 它们通常搭配在一起使用。
   4. 推荐参考： https://segmentfault.com/a/1190000014121749

10. `HappyPack`: 让 Webpack 把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。

    1. `id: String` 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件.

       `loaders: Array` 用法和 webpack Loader 配置中一样.

       `threads: Number` 代表开启几个子进程去处理这一类型的文件，默认是 3 个，类型必须是整数。

       `verbose: Boolean` 是否允许 HappyPack 输出日志，默认是 true。

       `threadPool: HappyThreadPool` 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。

       `verboseWhenProfiling: Boolean` 开启`webpack --profile` ,仍然希望 HappyPack 产生输出。

       `debug: Boolean` 启用 debug 用于故障排查。默认 `false`。

11. `ParallelUglifyPlugin`:可以把对 JS 文件的串行压缩变为开启多个子进程并行执行&oq=可以把对 JS 文件的串行压缩变为开启多个子进程并行执行

12. 在支持 es6 的环境中直接使用 es6，不进行转换

13. `splitChunks`: 提取公共代码

14. 区分环境，使用 mode

15. 代码分离

具体细节配置可参考，https://github.com/nvnvyezi/init-webpack

### package

#### babel-preset-env

根据配置的目标浏览器或者运行环境来自动将 ES2015+的代码转换为 es5。

**参数**

- targets
- targets.node
- targets.browsers
- spec : 启用更符合规范的转换，但速度会更慢，默认为 `false`
- loose：是否使用 `loose mode`，默认为 `false`
- modules：将 ES6 module 转换为其他模块规范，可选 `"adm" | "umd" | "systemjs" | "commonjs" | "cjs" | false`，默认为 `false`
- debug：启用 debug，默认 `false`
- include：一个包含使用的 `plugins` 的数组
- exclude：一个包含不使用的 `plugins` 的数组
- useBuiltIns：为 `polyfills` 应用 `@babel/preset-env` ，可选 `"usage" | "entry" | false`，默认为 `false`

#### @babel/preset-react

[文档](https://www.babeljs.cn/docs/babel-preset-react)

#### html-loader

[文档](https://webpack.docschina.org/loaders/html-loader/)

#### html-webpack-plugin

[文档](https://webpack.docschina.org/plugins/html-webpack-plugin/)

#### mini-css-extract-plugin

[文档](https://github.com/webpack-contrib/mini-css-extract-plugin)

#### postcss-loader

[文档](https://www.webpackjs.com/loaders/postcss-loader/)

#### webpack-parallel-uglify-plugin

[使用](https://www.cnblogs.com/tugenhua0707/p/9569762.html)

#### @babel/plugin-proposal-class-properties

[文档](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)

#### @babel/plugin-proposal-export-default-from

[文档](https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from)

#### @babel/plugin-proposal-export-namespace-from

[文档](https://babeljs.io/docs/en/babel-plugin-proposal-export-namespace-from)

#### @babel/plugin-proposal-object-rest-spread

[文档](https://babeljs.io/docs/en/babel-plugin-proposal-object-rest-spread)

#### @babel/plugin-proposal-optional-chaining

[文档](https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining)

#### @babel/plugin-syntax-dynamic-import

[文档](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import)

#### @babel/plugin-transform-runtime

[文档](https://babeljs.io/docs/en/babel-plugin-transform-runtime)

#### @babel/preset-typescript

[文档](https://babeljs.io/docs/en/babel-preset-typescript)

#### eslint-plugin-react-hooks

[使用说明](http://react.html.cn/docs/hooks-rules.html)
