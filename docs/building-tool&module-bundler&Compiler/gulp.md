---
tags: [workflows]
---

[gulp](https://gulpjs.com/docs/en/getting-started/quick-start) 将开发流程中让人痛苦或耗时的任务自动化，从而减少你所浪费的时间、创造更大价值。 

[中文文档](https://www.gulpjs.com.cn/)

## 安装
1. 如果先前将 gulp 安装到全局环境中了，请执行 `npm rm --global gulp` 将 gulp 删除
2. 安装 gulp 命令行工具: `npm install --global gulp-cli`
3. 创建项目目录并在项目目录下创建 `package.json` 文件: `npx mkdirp my-project` `npm init`
4. 安装 gulp，作为开发时依赖项: `npm install --save-dev gulp`
5. 检查 gulp 版本: `gulp --version`
6. 在项目大的根目录下创建一个名为 `gulpfile.js` 的文件，该文件在运行 `gulp` 命令时会被自动加载，该文件中任何导出（`export`）的函数都将注册到 gulp 的任务（`task`）系统中。

## 创建任务
- 每个 gulp 任务（task）都是一个异步的 JavaScript 函数，此函数是一个可以接收 `callback` 作为参数的函数，或者是一个返回 `stream`、`promise`、`event emitter`、`child process` 或 `observable` 类型值的函数。

- 如需将一个任务（task）注册为公开（public）类型的，只需从 `gulpfile.js` 中导出（export）即可。公开类型的任务可以被 `gulp` 命令直接调用。
  ```js title="gulpfile.js"
  const { series } = require('gulp');

  // `clean` 函数并未被导出（export），因此被认为是私有任务（private task）。
  // 它仍然可以被用在 `series()` 组合中。
  function clean(cb) {
    // body omitted
    cb();
  }

  // `build` 函数被导出（export）了，因此它是一个公开任务（public task），并且可以被 `gulp` 命令直接调用。
  // 它也仍然可以被用在 `series()` 组合中。
  function build(cb) {
    // body omitted
    cb();
  }

  exports.build = build;
  exports.default = series(clean, build);
  ```

## 组合任务
gulp 提供了两个强大的组合方法： `series()` 和 `parallel()`，允许将多个独立的任务组合为一个更大的操作。这两个方法都可以接受任意数目的任务（task）函数或已经组合的操作。

- 如果需要让任务（task）按顺序执行，请使用 `series()` 方法。
  ```js title="gulpfile.js"
  const { series } = require('gulp');

  function transpile(cb) {
    // body omitted
    cb();
  }

  function bundle(cb) {
    // body omitted
    cb();
  }

  exports.build = series(transpile, bundle);
  ```

- 对于希望以最大并发来运行的任务（tasks），可以使用 `parallel()` 方法将它们组合起来。
  ```js title="gulpfile.js"
  const { parallel } = require('gulp');

  function javascript(cb) {
    // body omitted
    cb();
  }

  function css(cb) {
    // body omitted
    cb();
  }

  exports.build = parallel(javascript, css);
  ```

- 当 `series()` 或 `parallel()` 被调用时，任务（tasks）被立即组合在一起。这就允许在组合中进行改变，而不需要在单个任务（task）中进行条件判断。
  ```js title="gulpfile.js"
  const { series } = require('gulp');

  function minify(cb) {
    // body omitted
    cb();
  }


  function transpile(cb) {
    // body omitted
    cb();
  }

  function livereload(cb) {
    // body omitted
    cb();
  }

  if (process.env.NODE_ENV === 'production') {
    exports.build = series(transpile, minify);
  } else {
    exports.build = series(transpile, livereload);
  }
  ```

- `series()` 和 `parallel()` 可以互相嵌套至任意深度。
  ```js title="gulpfile.js"
  const { series, parallel } = require('gulp');

  function clean(cb) {
    // body omitted
    cb();
  }

  function cssTranspile(cb) {
    // body omitted
    cb();
  }

  function cssMinify(cb) {
    // body omitted
    cb();
  }

  function jsTranspile(cb) {
    // body omitted
    cb();
  }

  function jsBundle(cb) {
    // body omitted
    cb();
  }

  function jsMinify(cb) {
    // body omitted
    cb();
  }

  function publish(cb) {
    // body omitted
    cb();
  }

  exports.build = series(
    clean,
    parallel(
      cssTranspile,
      series(jsTranspile, jsBundle)
    ),
    parallel(cssMinify, jsMinify),
    publish
  );
  ```

- 当一个组合操作执行时，这个组合中的每一个任务每次被调用时都会被执行。例如，在两个不同的任务（task）之间调用的 clean 任务（task）将被执行两次，并且将导致不可预期的结果。因此，最好重构组合中的 clean 任务（task）。如下重构示例：
  ```js title="gulpfile.js"
  // 重构前 This is INCORRECT
  const { series, parallel } = require('gulp');

  const clean = function(cb) {
    // body omitted
    cb();
  };

  const css = series(clean, function(cb) {
    // body omitted
    cb();
  });

  const javascript = series(clean, function(cb) {
    // body omitted
    cb();
  });

  exports.build = parallel(css, javascript);

  // 重构后
  const { series, parallel } = require('gulp');

  function clean(cb) {
    // body omitted
    cb();
  }

  function css(cb) {
    // body omitted
    cb();
  }

  function javascript(cb) {
    // body omitted
    cb();
  }

  exports.build = series(clean, parallel(css, javascript));
  ```

- 当使用 `series()` 组合多个任务（task）时，任何一个任务（task）的错误将导致整个任务组合结束，并且不会进一步执行其他任务。

- 当使用 `parallel()` 组合多个任务（task）时，一个任务的错误将结束整个任务组合的结束，但是其他并行的任务（task）可能会执行完，也可能没有执行完。

## 异步执行
当从任务（task）中返回 `stream`、`promise`、`event emitter`、`child process` 或 `observable` 时，成功或错误值将通知 gulp 是否继续执行或结束。如果任务（task）出错，gulp 将立即结束执行并显示该错误。

- 返回 `stream`
  ```js title="gulpfile.js"
  const { src, dest } = require('gulp');

  function streamTask() {
    return src('*.js')
      .pipe(dest('output'));
  }

  exports.default = streamTask;
  ```

- 返回 `promise`
  ```js title="gulpfile.js"
  function promiseTask() {
    return Promise.resolve('the value is ignored');
  }

  exports.default = promiseTask;
  ```

- 返回 `event emitter`
  ```js title="gulpfile.js"
  const { EventEmitter } = require('events');

  function eventEmitterTask() {
    const emitter = new EventEmitter();
    // Emit has to happen async otherwise gulp isn't listening yet
    setTimeout(() => emitter.emit('finish'), 250);
    return emitter;
  }

  exports.default = eventEmitterTask;
  ```

- 返回 `child process`
  ```js title="gulpfile.js"
  const { exec } = require('child_process');

  function childProcessTask() {
    return exec('date');
  }

  exports.default = childProcessTask;
  ```

- 返回 `observable`
  ```js title="gulpfile.js"
  const { Observable } = require('rxjs');

  function observableTask() {
    return Observable.of(1, 2, 3);
  }

  exports.default = observableTask;
  ```

- 如果任务（task）不返回任何内容，则必须使用 `callback` 来指示任务已完成。
  ```js title="gulpfile.js"
  function callbackTask(cb) {
    // `cb()` should be called by some async work
    cb();
  }

  exports.default = callbackTask;

  // 通常会将此 callback 函数传递给另一个 API ，而不是自己调用它
  const fs = require('fs');

  function passingCallback(cb) {
    fs.access('gulpfile.js', cb);
  }

  exports.default = passingCallback;
  ```

- 如需通过 `callback` 把任务（task）中的错误告知 gulp，请将 `Error` 作为 `callback` 的唯一参数。
  ```js title="gulpfile.js"
  function callbackError(cb) {
    // `cb()` should be called by some async work
    cb(new Error('kaboom'));
  }

  exports.default = callbackError;
  ```

- 当你看到 "Did you forget to signal async completion?" 警告时，说明你并未使用前面提到的返回方式。你需要使用 `callback` 或返回 `stream`、`promise`、`event emitter`、`child process`、`observable` 来解决此问题。

- 除了以上几种方式，还可以将任务（task）定义为一个 `async` 函数，它将利用 `promise` 对你的任务（task）进行包装。这将允许你使用 `await` 处理 `promise`，并使用其他同步代码。
  ```js title="gulpfile.js"
  const fs = require('fs');

  async function asyncAwaitTask() {
    const { version } = fs.readFileSync('package.json');
    console.log(version);
    await Promise.resolve('some result');
  }

  exports.default = asyncAwaitTask;
  ```

## 处理文件
- gulp 暴露了 `src()` 和 `dest()` 方法用于处理计算机上存放的文件。

- `src()` 接受 glob 参数，并从文件系统中读取文件然后生成一个 Node 流（stream）。它将所有匹配的文件读取到内存中并通过流（stream）进行处理。流（stream）所提供的主要的 API 是 `pipe()` 方法，用于连接转换流（Transform streams）或可写流（Writable streams）。

- `dest()` 接受一个输出目录作为参数，并且它还会产生一个 Node 流（stream），通常作为终止流（terminator stream）。当它接收到通过管道（pipeline）传输的文件时，它会将文件内容及文件属性写入到指定的目录中。

- 大多数情况下，利用 `pipe()` 方法将插件放置在 `src()` 和 `dest()` 之间，并转换流（stream）中的文件。
  ```js title="gulpfile.js"
  const { src, dest } = require('gulp');
  const babel = require('gulp-babel');

  exports.default = function() {
    return src('src/*.js')
      .pipe(babel())
      .pipe(dest('output/'));
  }
  ```

- `src()` 也可以放在管道（pipeline）的中间，以根据给定的 glob 向流（stream）中添加文件。新加入的文件只对后续的转换可用。如果 glob 匹配的文件与之前的有重复，仍然会再次添加文件。
  ```js title="gulpfile.js"
  const { src, dest } = require('gulp');
  const babel = require('gulp-babel');
  const uglify = require('gulp-uglify');

  exports.default = function() {
    return src('src/*.js')
      .pipe(babel())
      .pipe(src('vendor/*.js'))
      .pipe(uglify())
      .pipe(dest('output/'));
  }
  ```

- `dest()` 可以用在管道（pipeline）中间用于将文件的中间状态写入文件系统。当接收到一个文件时，当前状态的文件将被写入文件系统，文件路径也将被修改以反映输出文件的新位置，然后该文件继续沿着管道（pipeline）传输。
  ```js title="gulpfile.js"
  const { src, dest } = require('gulp');
  const babel = require('gulp-babel');
  const uglify = require('gulp-uglify');
  const rename = require('gulp-rename');

  // 在同一个管道（pipeline）中创建未压缩（unminified）和已压缩（minified）的文件
  exports.default = function() {
    return src('src/*.js')
      .pipe(babel())
      .pipe(src('vendor/*.js'))
      .pipe(dest('output/'))
      .pipe(uglify())
      .pipe(rename({ extname: '.min.js' }))
      .pipe(dest('output/'));
  }
  ```

- `src()` 可以工作在三种模式下：缓冲（buffering）、流动（streaming）和空（empty）模式。这些模式可以通过对 `src()` 的 `buffer` 和 `read` 参数 进行设置。
  - 缓冲（Buffering）模式是默认模式，将文件内容加载内存中。插件通常运行在缓冲（buffering）模式下，并且许多插件不支持流动（streaming）模式。
  - 流动（Streaming）模式的存在主要用于操作无法放入内存中的大文件，例如巨幅图像或电影。文件内容从文件系统中以小块的方式流式传输，而不是一次性全部加载。如果需要流动（streaming）模式，请查找支持此模式的插件或自己编写。
  - 空（Empty）模式不包含任何内容，仅在处理文件元数据时有用。

### glob
- glob 是由普通字符 和 `/` 或 通配字符组成的字符串，用于匹配文件路径。可以利用一个或多个 glob 在文件系统中定位文件。

- `src()` 方法接受一个 glob 字符串或由多个 glob 字符串组成的数组作为参数，用于确定哪些文件需要被操作。glob 或 glob 数组必须至少匹配到一个匹配项，否则 `src()` 将报错。当使用 glob 数组时，将按照每个 glob 在数组中的位置依次执行匹配

#### 字符串片段
- 在 glob 中，分隔符永远是 `/` 字符，不区分操作系统，即便是在采用 `\\` 作为分隔符的 Windows 操作系统中。通过 `split('/')` 得到的数组每一项是一个字符串片段（segment）。例如：`src/index.js` 有两个片段，分别是 `src` 和 `index.js`；`src/**/*.js` 有三个片段，分别是 `src`、`**` 和 `*.js`

- 在 glob 中，`\\` 字符被保留作为转义符使用。`'glob_with_uncommon_\\*_character.js'` 这个glob中 `*` 被转义了，因此，`*` 将被作为一个普通字符使用，而不再是通配符了。

#### `*`
- 在 一个字符串片段（segment）中 匹配任意数量的字符，包括零个匹配。对于匹配单级目录下的文件很有用。

- `'*.js'` 能够匹配类似 `index.js` 的文件，但是不能匹配类似 `scripts/index.js` 或 `scripts/nested/index.js` 的文件。

- 注意：`*` 不能匹配分隔符 `/`，也就是说不能跨片段匹配字符。例如：`src/*.js` 表示 `src` 目录下所有以 `js` 结尾的文件，但是不能匹配 `src` 子目录中的文件，例如 `src/login/login.js`

#### `**`
- 在多个字符串片段中匹配任意数量的字符，包括零个匹配。 对于匹配嵌套目录下的文件很有用。也就是说 `**` 是递归匹配所有文件和目录的，如果后面有分隔符，即 `**/` 的话，则表示只递归匹配所有目录（不含隐藏目录）。

- 请确保适当地限制带有两个星号的 glob 的使用，以避免匹配大量不必要的目录。

- `'scripts/**/*.js'` 这个 glob 被适当地限制在 `scripts/` 目录下。它将匹配类似 `scripts/index.js`、`scripts/nested/index.js` 和 `scripts/nested/twice/index.js` 的文件。注意：如果没有 `scripts/` 这个前缀做限制，`node_modules` 目录下的所有目录或其他目录也都将被匹配。

#### glob base
glob base (有时称为 glob parent)是 glob 字符串中任何特殊字符之前的路径段。因此，`/src/js/**.js` 的 blob base 是 `/src/js/`。所有匹配 glob 的路径都保证共享 glob base(该路径段不能是可变的)。

由 `src()` 生成的 Vinyl 实例是用 glob base 集作为它们的 `base` 属性构造的。当使用 `dest()` 写入文件系统时，将从输出路径中删除 `base` ，以保留目录结构。

## [插件](https://gulpjs.com/plugins/)
- gulp 插件实质上是 Node 转换流（Transform Streams），它封装了通过管道（pipeline）转换文件的常见功能，通常是使用 `pipe()` 方法并放在 `src()` 和 `dest()` 之间。他们可以更改经过流（stream）的每个文件的文件名、元数据或文件内容。
  ```js title="gulpfile.js"
  const { src, dest } = require('gulp');
  const uglify = require('gulp-uglify');
  const rename = require('gulp-rename');

  exports.default = function() {
    return src('src/*.js')
      // gulp-uglify 插件并不改变文件名
      .pipe(uglify())
      // 因此使用 gulp-rename 插件修改文件的扩展名
      .pipe(rename({ extname: '.min.js' }))
      .pipe(dest('output/'));
  }
  ```

- 插件应当总是用来转换文件的。其他操作都应该使用（非插件的） Node 模块或库来实现。
  ```js title="gulpfile.js"
  const del = require('delete');

  exports.default = function(cb) {
    // 直接使用 `delete` 模块，避免使用 gulp-rimraf 插件
    del(['output/*.js'], cb);
  }
  ```

- 因为插件的操作不应该针对特定文件类型，因此你可能需要使用像 `gulp-if` 之类的条件插件来完成转换某些文件的操作。
  ```js title="gulpfile.js"
  const { src, dest } = require('gulp');
  const gulpif = require('gulp-if');
  const uglify = require('gulp-uglify');

  function isJavaScript(file) {
    // 判断文件的扩展名是否是 '.js'
    return file.extname === '.js';
  }

  exports.default = function() {
    // 在同一个管道（pipeline）上处理 JavaScript 和 CSS 文件
    return src(['src/*.js', 'src/*.css'])
      // 只对 JavaScript 文件应用 gulp-uglify 插件
      .pipe(gulpif(isJavaScript, uglify()))
      .pipe(dest('output/'));
  }
  ```

- 内联插件是一次性的转换流（Transform Streams），你可以通过在 `gulpfile.js` 文件直接书写需要的功能。在两种情况下，创建内联插件很有用：1) 避免自己创建并维护插件。2) 避免 fork 一个已经存在的插件并添加自己所需的功能。
  ```js title="gulpfile.js"
  const { src, dest } = require('gulp');
  const uglify = require('uglify-js');
  const through2 = require('through2');

  exports.default = function() {
    return src('src/*.js')
      // 创建一个内联插件，从而避免使用 gulp-uglify 插件
      .pipe(through2.obj(function(file, _, cb) {
        if (file.isBuffer()) {
          const code = uglify.minify(file.contents.toString())
          file.contents = Buffer.from(code)
        }
        cb(null, file);
      }))
      .pipe(dest('output/'));
  }
  ```