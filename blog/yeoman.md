---
tags: [scaffolding, 脚手架]
---

[Yeoman](https://yeoman.io/) 是一个开源的客户端脚手架生成工具，用于web应用开发。它帮助开发者快速搭建新的项目，提供了一套标准化的工具和流程来加速开发。Yeoman 本身是基于Node.js的，它通过脚手架（scaffolding）、任务运行器（如Grunt和Gulp）以及包管理（如Bower和npm）等工具，帮助开发者自动化常见的开发任务，比如创建项目结构、添加库依赖、运行测试等。Yeoman 主要用于以下几种场景：
- **快速启动新项目**：Yeoman 可以快速生成项目的基础结构，包括目录、文件以及代码模板，这对于想要迅速开始编码的开发者来说非常有用。

- **保持项目结构一致性**：在团队协作中，Yeoman 可以确保每个新项目或组件都遵循相同的目录结构和编码规范，有助于维护代码的一致性和可读性。

- **自动化工作流**：Yeoman 可以集成任务运行器（如Grunt或Gulp）和包管理器（如npm或Bower），自动化重复性的任务，如压缩图片、编译CSS和JavaScript、运行测试等。

- **快速集成前端库和框架**：Yeoman 脚手架通常会包含流行的前端库和框架，如React、Angular、Vue等，这样开发者就不需要手动下载和配置这些依赖。

- **创建自定义生成器**：如果现有的脚手架不能满足特定需求，开发者可以创建自定义的Yeoman生成器，以适应特定的项目结构或编码规范。

总的来说，Yeoman 是一个适用于多种开发场景的工具，特别是在需要快速搭建和维护前端项目结构时。

## 创建generator
### 目录结构
创建一个文件夹，该文件夹必须命名为`generator-name`（其中`name`是generator的名称）。Yeoman 依赖文件系统来查找可用的generator。在该文件夹下创建`package.json`，并执行`npm install --save yeoman-generator`
```json title="package.json"
{
  "name": "generator-demo",
  "version": "0.1.0",
  "description": "",
  "files": [
    "generators"
  ],
  "keywords": ["yeoman-generator"],
  "dependencies": {
    "yeoman-generator": "^1.0.0"
  }
}
```

当您调用 `yo name` 时使用的默认generator是`app` generator。它必须包含在 `app` 目录中。当您调用 `yo name:subcommand` 时使用的sub generator包含在`subcommand`目录中。假如`generator-demo`目录结构如下（`package.json`中`files`属性的值为`["generators"]`），则执行`npm install -g yo generator-demo`安装`yo`和`generator-demo`后，可以执行`yo demo`和`yo demo:router`
```
├───package.json
└───generators/
    ├───app/
    │   └───index.js
    └───router/
        └───index.js
```

目录结构还可以如下，此时`package.json`中`files`属性的值应为`["app","router"]`
```
├───package.json
├───app/
│   └───index.js
└───router/
    └───index.js
```

### 扩展`yeoman-generator`
Yeoman 提供了一个基础生成器，您可以扩展它来实现您自己的行为。这个基本生成器将添加您期望减轻任务的大部分功能。
```js title="generators/app/index.js"
const Generator = require('yeoman-generator');

module.exports = class extends Generator {};
```

某些生成器方法只能在构造函数内部调用。这些特殊方法可能会执行诸如设置重要状态控制之类的操作，并且可能无法在构造函数之外运行。要重写生成器构造函数，请添加一个构造函数方法，如下所示：
```js title="generators/app/index.js"
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.option('babel'); // This method adds support for a `--babel` flag
  }

  method1() {
    this.log('method 1 just ran');
  }

  method2() {
    this.log('method 2 just ran');
  }
};
```

## 运行generator
每次运行generator时，实际上都在使用`yeoman-environment`，`npm install --save yeoman-environment`
```js
const yeoman = require('yeoman-environment');
const env = yeoman.createEnv();
```
注册`generator-demo`，有两种方式：
```js
const yeoman = require('yeoman-environment');
const env = yeoman.createEnv();

// 1. 基于路径注册generator，namespace('npm:app')是可选的
env.register(require.resolve('generator-npm'), 'npm:app');

// 2. 提供 generator constructor，这种方式需要提供namespace
const GeneratorNPM = generators.Base.extend(/* put your methods in here */);
env.registerStub(GeneratorNPM, 'npm:app');
```

可以根据需要注册任意数量的generator。如果namespace发生冲突，本地generator将覆盖全局generator。

运行generator，您只需将如下代码放入 `package.json bin` 指定的文件中，即可运行 Yeoman generator，而无需使用 `yo`。本地开发使用`npm link`调试。
```js
const yeoman = require('yeoman-environment');
const env = yeoman.createEnv();

env.register(require.resolve('generator-npm'), 'npm:app');

const done = function() {
  console.log('done')
}
env.run('npm:app', done); // 可以设置options: env.run('npm:app some-name', { 'skip-install': true }, done);
```
:::tip
在使用脚手架工具（如Yeoman）创建项目时，你可能不希望立即安装所有依赖项，而是首先调整生成的项目结构或配置。在这种情况下，你可以使用`'skip-install': true`的配置或命令行选项来跳过自动安装依赖的步骤。
:::

使用`lookup`获取npm安装的每个Yeoman generator的访问权限，每个查找到的generator会被注册
```js
const yeoman = require('yeoman-environment');
const env = yeoman.createEnv();

env.lookup(function () {
  env.run('angular');
});
```

## 方法执行顺序
直接附加到 Generator 原型的每个方法都被视为一个任务。每个任务都由 Yeoman environment 按顺序循环运行。

可用的优先级是（按运行顺序）：
1. `initializing`，初始化方法（检查当前项目状态、获取配置等）
2. `prompting`，提示用户选项的地方（调用 `this.prompt()` 的地方）
3. `configuring`，保存配置并配置项目（创建 `.editorconfig` 文件和其他元数据文件）
4. `default`，如果方法名称与优先级不匹配，它将被推送到该组。
5. `writing`，编写生成器特定文件（路线、控制器等）的地方
6. `conflicts`，处理冲突的地方（内部使用）
7. `install`，运行安装的地方（npm、bower）
8. `end`，最后调用，用于清理等

如何定义不会自动调用的辅助方法或私有方法？有三种不同的方法可以实现这一目标：
- 用下划线作为方法名称前缀
  ```js
  class extends Generator {
    method1() {
     console.log('hey 1');
    }

    _private_method() {
     console.log('private hey');
    }
   }
  ```

- 使用实例方法
  ```js
  class extends Generator {
    constructor(args, opts) {
      // Calling the super constructor is important so our generator is correctly set up
      super(args, opts)

      this.helperMethod = function () {
        console.log('won\'t be called automatically');
      };
    }
  }
  ```

- 继承父生成器
  ```js
  class MyBase extends Generator {
    helper() {
      console.log('methods on the parent generator won\'t be called automatically');
    }
  }

  module.exports = class extends MyBase {
    exec() {
      this.helper();
    }
  };
  ```

## 用户交互
Yeoman 使用适配器作为抽象层，以允许 IDE、代码编辑器等轻松提供运行生成器所需的用户界面。

适配器是负责处理与用户的所有交互的对象。如果您想提供与经典命令行不同的交互模型，您必须编写自己的适配器。与用户交互的每种方法都通过此适配器传递（主要是：提示、日志记录和比较）。

要安装适配器，请使用 `yeoman.createEnv(args, opts, adapter)` 的第三个参数。适配器应至少提供三种方法:
- `prompt()`，它提供问答功能（例如，当您开始时，会向用户提示一组可能的操作）。它的签名和行为遵循 `Inquirer.js` 的签名和行为。当生成器调用 `this.prompt` 时，该调用最终由适配器处理。该方法是异步的，返回一个Promise
- `diff()`
- `log()`，输出信息
Yeoman 默认提供了终端适配器(Terminal Adapter)，可以使用`this.prompt` `this.log` `this.diff`
```js
module.exports = class extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
      }
    ]);

    this.log("app name", answers.name);
    this.log("cool feature", answers.cool);
  }

  writing() {
    this.log("cool feature", this.answers.cool); // user answer `cool` used
  }
};
```

### 记住用户偏好
用户每次运行生成器时可能会对某些问题给出相同的输入。对于这些问题，您可能想要记住用户之前回答的内容，并将该答案用作新的默认答案。

Yeoman 通过向问题对象添加 `store` 属性来扩展 `Inquirer.js` API。此属性允许您指定用户提供的答案应用作将来的默认答案。这可以按如下方式完成：
```js
this.prompt({
  type: "input",
  name: "username",
  message: "What's your GitHub username",
  store: true
});
```

### 参数
参数直接从命令行传递，比如：`yo webapp my-project`
```js
module.exports = class extends Generator {
  // note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument("appname", { type: String, required: true });

    // And you can then access it later; e.g.
    this.log(this.options.appname);
  }
};
```

### 选项
使用`--`，比如：`yo webapp --coffee`
```js
module.exports = class extends Generator {
  // note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--coffee` flag
    this.option("coffee");

    // And you can then access it later; e.g.
    this.scriptSuffix = this.options.coffee ? ".coffee" : ".js";
  }
};
```

## 位置上下文
### `.yo-rc.json`
`.yo-rc.json` 文件是 Yeoman 生成器使用的配置文件。Yeoman 是一个通用的前端项目脚手架工具，用于自动化项目的搭建过程，比如创建新的项目、添加新的模块等。`.yo-rc.json` 文件存储了关于项目的配置信息，使得项目的结构和依赖能够被重现，这对于团队合作和项目的一致性非常重要。

这个文件通常位于项目的根目录，并且包含了用于生成项目的 Yeoman 生成器的配置选项。这些配置选项可以包括项目名称、版本、使用的技术栈、编码风格偏好等。

例如，如果你使用了一个名为 `generator-webapp` 的 Yeoman 生成器来创建一个 web 应用，`.yo-rc.json` 文件可能看起来像这样：

```json
{
  "generator-webapp": {
    "appName": "My Awesome App",
    "ui": {
      "key": "value"
    },
    "wiredep": {
      "directory": "bower_components"
    }
  }
}
```

这个文件的具体内容将取决于你使用的具体生成器以及在项目初始化过程中所做的选择。

当你或你的团队成员在项目中运行 Yeoman 生成器时，Yeoman 会查找 `.yo-rc.json` 文件，并使用其中的配置来确保生成的代码和结构与项目的其他部分保持一致。这样做有助于维护项目的一致性和可维护性。

### 根目录
可以使用 `this.destinationRoot()` 获取项目根目录 或 使用 `this.destinationPath('sub/path')` 获取根目录下的文件
```js
// Given destination root is ~/projects
class extends Generator {
  paths() {
    this.destinationRoot();
    // returns '~/projects'

    this.destinationPath('index.js');
    // returns '~/projects/index.js'
  }
}
```

### 模板目录
模板上下文是存储模板文件的文件夹。模板上下文默认定义为 `./templates/`。您可以使用 `this.sourceRoot('new/template/path')` 覆盖此默认值。

您可以使用 `this.sourceRoot()` 或使用 `this.templatePath('app/index.js')` 加入路径来获取路径值。
```js
class extends Generator {
  paths() {
    this.sourceRoot();
    // returns './templates'

    this.templatePath('index.js');
    // returns './templates/index.js'
  }
};
```

### `this.fs`
例如，使用 `this.fs.copyTpl` 方法复制文件，同时将内容作为模板进行处理。 `copyTpl` 使用 `ejs` 模板语法。
```html title="generators/app/templates/index.html"
<html>
  <head>
    <title><%= title %></title>
  </head>
</html>
```
```js
class extends Generator {
  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: 'Templating with Yeoman' }
    );
  }
}
```
```html title="public/index.html"
<html>
  <head>
    <title>Templating with Yeoman</title>
  </head>
</html>
```

一个非常常见的场景是在提示阶段存储用户答案并将其用于模板：
```js
class extends Generator {
  async prompting() {
    this.answers = await this.prompt([{
      type    : 'input',
      name    : 'title',
      message : 'Your project title',
    }]);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: this.answers.title } // user answer `title` used
    );
  }
}
```

:::tip
更新预先存在的文件并不总是一项简单的任务。最可靠的方法是解析文件 AST（抽象语法树）并对其进行编辑。此解决方案的主要问题是编辑 AST 可能很冗长并且有点难以掌握。

一些流行的 AST 解析器是：
- [Cheerio](https://github.com/cheeriojs/cheerio) 用于解析 HTML。

- 用于解析 JavaScript 的 [Esprima](https://github.com/ariya/esprima) - 您可能对 [AST-Query](https://github.com/SBoudrias/ast-query) 感兴趣，它提供了较低级别的 API 来编辑 Esprima 语法树。

对于 JSON 文件，您可以使用本机 [JSON 对象方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)。

[Gruntfile Editor](https://github.com/SBoudrias/gruntfile-editor) 用于动态修改 Gruntfile。

使用 RegEx 解析代码文件是一条危险的道路，在此之前，您应该阅读此 CS 人类学答案并掌握 RegEx 解析的缺陷。如果您选择使用 RegEx 而不是 AST 树编辑现有文件，请小心并提供完整的单元测试。 - 请不要破坏您的用户的代码。
:::