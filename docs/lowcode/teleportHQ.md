---
tags: [低代码, lowcode]
---

[teleportHQ](https://teleporthq.io/)

[teleportHQ REPL](https://repl.teleporthq.io/)

## [UIDL](https://docs.teleporthq.io/uidl/structure.html)
User Interface Definition Language 用户界面定义语言，由人类可读的 JSON 文档表示（JSON是许多编程语言本身支持的格式）。例如：
```js
const uidl = {
  "name": "My First Component",
  "node": {
    "type": "element",
    "content": {
      "elementType": "text",
      "children": [
        {
          "type": "static",
          "content": "Hello World!"
        }
      ]
    }
  }
}
```

### 节点类型
UIDL的节点`node`具有相同的结构，如下：
```ts
{
  type: string
  content: any
}
```

其中`type`可用的值有：`static`, `dynamic`, `element`, `conditional`, `repeat`, `slot`, `nested-style`，当遍历 UIDL 时，节点被解释并转换为代码行
:::warning
v0.13.0 版本后，不再支持`nested-style`。
:::

#### `element`节点
定义：

```ts
interface UIDLElementNode {
  type: "element";
  content: {
    elementType: string;
    semanticType?: string;
    name?: string;
    key?: string; // internal usage
    dependency?: UIDLDependency;
    style?: UIDLStyleDefinitions;
    attrs?: Record<string, UIDLAttributeValue>;
    events?: UIDLEventDefinitions;
    abilities?: {
      link?: UIDLLinkNode;
    };
    referencedStyles?: UIDLReferencedStyles;
    children?: UIDLNode[];
    selfClosing?: boolean;
    ignore?: boolean;
  };
}
```

示例：

```json
{
  "type": "element",
  "content": {
    "elementType": "image",
    "attrs": {
      "url": "path/to/avatar.jpg"
    }
  }
}
```

- `elementType` 抽象元素的类型，例如：'container', 'text', 'image'等（映射时container被映射为div，image被映射为img）
- `name` 每个元素都可以有一个自定义名称
- `dependency` 添加有关元素的信息（如果它是自定义组件或从外部包中使用的组件）
- `style` 定义元素的样式
- `attrs` 定义添加到该元素上的任何属性。对于自定义元素，属性将被转换为内部的动态值。
- `events` 定义可以添加到事件处理程序上的事件列表。
- `children` 使用这个字段来确保整个组件的树状结构。
- `referencedStyles` 用于引用项目样式表中的样式或为节点定义媒体样式。

:::tip
`element`节点可以包含其他`element`节点作为子节点，并且 `elementType` 必须存在于生成器使用的映射中，或者应定义为项目的组件之一。例子：
```json
{
  "name": "ImageElement",
  "node": {
    "type": "element",
    "content": {
      "elementType": "container",
      "children": [
        {
          "type": "element",
          "content": {
            "elementType": "image",
            "attrs": {
              "url": {
                "type": "static",
                "content": "path/to/avatar/url"
              }
            },
            "style": {
              "width": "100px",
              "height": "100px"
            }
          }
        }
      ]
    }
  }
}
```

使用Vue生成器转换后：
```
<template>
  <div><img src="path/to/avatar/url" class="image-element-image" /></div>
</template>

<script>
export default {
  name: 'ImageElement',
}
</script>

<style scoped>
.image-element-image {
  width: 100px;
  height: 100px;
}
</style>
```
:::

#### `dynamic` 模板内的表达式
示例：
```json
{
  "propDefinitions": {
    "authorAvatarUrl": {
      "type": "string"
    }
  },
  "name": "ImageElement",
  "node": {
    "type": "element",
    "content": {
      "elementType": "image",
      "attrs": {
        "url": {
          "type": "dynamic",
          "content": {
            "referenceType": "prop",
            "id": "authorAvatarUrl"
          }
        }
      }
    }
  }
}
```

使用Vue生成器转换后：
```
<template>
  <img :src="authorAvatarUrl" />
</template>

<script>
export default {
  name: 'ImageElement',
  props: {
    authorAvatarUrl: String,
  },
}
</script>
```

使用React生成器转换后：
```jsx
import React from 'react'

import PropTypes from 'prop-types'

const ImageElement = (props) => {
  return <img src={props.authorAvatarUrl} />
}

ImageElement.propTypes = {
  authorAvatarUrl: PropTypes.string,
}

export default ImageElement
```

#### `static` 纯文本
定义：
```ts
interface UIDLStaticValue {
  type: "static";
  content: string | number | boolean;
}
```

#### `conditional`节点
条件表达式场景（例如：Vue 中的 `v-if`）可使用该节点。

定义：
```ts
interface UIDLConditionalNode {
  type: "conditional";
  content: {
    node: UIDLNode;
    reference: UIDLDynamicReference;
    value?: string | number | boolean;
    condition?: {
      conditions: Array<{
        operation: string;
        operand?: string | boolean | number;
      }>;
      matchingCriteria?: string;
    };
  };
}
```

`condition`的示例：
```json
{
  "conditions": [
    { "operation": ">", "operand": 3 },
    { "operation": "<=", "operand": 5 }
  ],
  "matchingCriteria": "all"
}
```
将被转换为：`reference > 3 && reference <= 5;`

`conditional`节点的示例：
```json
{
  "name": "MyConditionalElement",
  "stateDefinitions": {
    "isVisible": {
      "type": "boolean",
      "defaultValue": true
    }
  },
  "node": {
    "type": "element",
    "content": {
      "elementType": "div",
      "children": [
        {
          "type": "conditional",
          "content": {
            "reference": {
              "type": "dynamic",
              "content": {
                "referenceType": "state",
                "id": "isVisible"
              }
            },
            "value": true,
            "node": {
              "type": "element",
              "content": {
                "elementType": "text",
                "children": [
                  {
                    "type": "static",
                    "content": "Now you see me!"
                  }
                ]
              }
            }
          }
        }
      ]
    }
  }
}
```

使用React生成器转换后：
```jsx
import React, { useState } from 'react'

const MyConditionalElement = (props) => {
  const [isVisible, setIsVisible] = useState(true)
  return <div>{isVisible && <span>Now you see me!</span>}</div>
}

export default MyConditionalElement
```

使用Vue生成器转换后：
```
<template>
  <div><span v-if="isVisible">Now you see me!</span></div>
</template>

<script>
export default {
  name: 'MyConditionalElement',

  data() {
    return {
      isVisible: true,
    }
  },
}
</script>
```

#### `repeat`节点
该节点允许您表示重复结构内的节点（例如：Vue 中的 `v-for`）。

定义：
```ts
interface UIDLRepeatNode {
  type: "repeat";
  content: {
    node: UIDLNode;
    dataSource: UIDLAttributeValue;
    meta?: {
      useIndex?: boolean;
      iteratorName?: string;
      dataSourceIdentifier?: string;
    };
  };
}
```

示例：
```json
{
  "name": "MyRepeatElement",
  "propDefinitions": {
    "items": {
      "type": "array",
      "defaultValue": ["hello", "world"]
    }
  },
  "node": {
    "type": "element",
    "content": {
      "elementType": "div",
      "children": [
        {
          "type": "repeat",
          "content": {
            "node": {
              "type": "element",
              "content": {
                "elementType": "text",
                "children": [
                  {
                    "type": "dynamic",
                    "content": {
                      "referenceType": "local",
                      "id": "item"
                    }
                  }
                ]
              }
            },
            "dataSource": {
              "type": "dynamic",
              "content": {
                "referenceType": "prop",
                "id": "items"
              }
            },
            "meta": {
              "useIndex": true,
              "iteratorName": "item"
            }
          }
        }
      ]
    }
  }
}
```
- `dataSource`是要遍历的数据源
- `meta.useIndex`是否使用`index`作为`key`
- `meta.iteratorName`迭代的name

使用Vue生成器转换后：
```
<template>
  <div><span v-for="(item, index) in items" :key="index">{{ item }}</span></div>
</template>

<script>
export default {
  name: 'MyRepeatElement',
  props: {
    items: {
      type: Array,
      default: () => ['hello', 'world'],
    },
  },
}
</script>
```

使用React生成器转换后：
```
import React from 'react'

import PropTypes from 'prop-types'

const MyRepeatElement = (props) => {
  return (
    <div>
      {props.items.map((item, index) => (
        <span key={index}>{item}</span>
      ))}
    </div>
  )
}

MyRepeatElement.defaultProps = {
  items: ['hello', 'world'],
}

MyRepeatElement.propTypes = {
  items: PropTypes.array,
}

export default MyRepeatElement
```

### 组件UIDL
定义：
```ts
interface ComponentUIDL {
  name: string;
  node: UIDLElementNode;
  styleSetDefinitions?: Record<string, UIDLStyleSetDefinition>;
  propDefinitions?: Record<string, UIDLPropDefinition>;
  importDefinitions?: Record<string, UIDLExternalDependency>;
  peerDefinitions?: Record<string, UIDLPeerDependency>;
  stateDefinitions?: Record<string, UIDLStateDefinition>;
  outputOptions?: UIDLComponentOutputOptions;
  designLanguage?: {
    tokens?: UIDLDesignTokens;
  };
  seo?: UIDLComponentSEO;
}
```

#### `propDefinitions`
组件必须通过 `propDefinitions` 定义其 `props` 才能安全地使用它们。

定义：
```ts
interface UIDLPropDefinition {
  type: string
  defaultValue?: string | number | boolean | ...
  isRequired?: boolean
  meta?: Record<string, any>
}
```

示例：
```json
{
 "propDefinitions": {
    "title": {
      "type": "string",
      "defaultValue": "Hello"
    },
    "items": {
      "type": "array",
      "defaultValue": []
    },
    "isShareable": {
      "type": "boolean",
      "defaultValue": false
    },
    "isDisplayed": {
      "type": "boolean",
      "defaultValue": true
    }
  }
}
```

#### `stateDefinitions`
定义：
```ts
interface UIDLStateDefinition {
  type: string // 表示状态的类型（例如：字符串、数字、布尔值、对象、数组等）
  defaultValue: string | number | boolean | ... // 初始状态值
  values?: Array<{
    value: string | number | boolean
    meta?: { ... }
  }>
}
```

示例：
```json
{
  "stateDefinitions": {
    "isVisible": {
      "type": "boolean",
      "defaultValue": true
    },
    "isShareable": {
      "type": "boolean",
      "defaultValue": false
    }
  }
}
```

#### 具有依赖关系的组件UIDL
有时我们可能想要依赖第三方包来获取特定组件，或者我们想要自己定义组件并在多个地方重用它们。可以使用`dependency`，例如：
```json
{
  "name": "ElementWithDependecies",
  "node": {
    "type": "element",
    "content": {
      "elementType": "div",
      "children": [
        {
          "type": "element",
          "content": {
            "attrs": {
              "some-value": {
                "type": "static",
                "content": "1"
              }
            },
            "elementType": "ReactDatepicker",
            "dependency": {
              "type": "package",
              "path": "react-datepicker",
              "version": "1.0.2",
              "meta": {
                "namedImport": false
              }
            }
          }
        },
        {
          "type": "element",
          "content": {
            "attrs": {
              "authorName": {
                "type": "static",
                "content": "Emma"
              }
            },
            "elementType": "AuthorCard",
            "dependency": {
              "type": "local"
            }
          }
        }
      ]
    }
  }
}
```

使用React生成器转换后：
```jsx
import React from 'react'

import AppComponent from 'react-datepicker'

import AppComponentAppComponent from './app-component'

const ElementWithDependecies = (props) => {
  return (
    <div>
      <AppComponent some-value="1"></AppComponent>
      <AppComponentAppComponent authorName="Emma"></AppComponentAppComponent>
    </div>
  )
}

export default ElementWithDependecies
```

### 根组件UIDL
根组件UIDL 支持 组件UIDL 中的所有字段。此外还支持`peerDefinitions`、`importDefinitions`、`styleSetDefinitions`

#### `peerDefinitions`
如下UIDL使用 `chakra-ui`，当我们通过代码生成器运行它时，生成器将自动导入 `@chakra-ui/core` 并将它添加到最后的 `package.json` 中。
```json
{
  "name": "Simple Component",
  "node": {
    "type": "element",
    "content": {
      "elementType": "component",
      "semanticType": "Button",
      "attrs": {
        "colorScheme": "blue"
      },
      "dependency": {
        "type": "package",
        "path": "@chakra-ui/core",
        "version": "0.8.0",
        "meta": {
          "namedImport": true
        }
      },
      "children": ["Button"]
    }
  }
}
```

但 `@chakra-ui/core` 需要 `@emotion/core`、`@emotion/styled` 和`emotion-theming`才能发挥作用。这些是伪依赖项，不直接在项目中使用。但我们需要它们才能使项目正常运行。因此，我们需要使用 `peerDeefinitions` 在 `root` 下定义它们:
```json
{
"root": {
  "peerDefinitions":{
    "@emotion/core":{
      "type":"package",
      "path":"@emotion/core",
      "version":"^10.0.34"
    },
    "@emotion/styled":{
      "type":"package",
      "path":"@emotion/styled",
      "version":"^10.0.27"
    },
    "emotion-theming":{
      "type":"package",
      "path":"emotion-theming",
      "version":"^10.0.27"
    }
  }
}
}
```
这些 `peerDefinitions` 被收集并添加到最后的 `package.json` 中。

#### `importDefinitions`
在 TeleportHQ 的 UIDL 中，`localDependency` 用于指定本地项目中的依赖项或模块。这些依赖项通常是项目内部定义的组件、工具函数或其他模块，而不是从外部库导入的内容。使用 `localDependency` 可以确保生成的代码正确引用项目内部的资源，从而确保项目的完整性和可维护性。定义：
```ts
export interface UIDLLocalDependency {
  type: 'local'
  path?: string
  meta?: {
    namedImport?: boolean
    originalName?: string
    importJustPath?: boolean
    importAlias?: string
  }
}
```
```ts
export interface UIDLExternalDependency {
  type: 'library' | 'package'
  path: string
  version: string
  meta?: {
    namedImport?: boolean
    originalName?: string
    importJustPath?: boolean
    useAsReference?: boolean
    importAlias?: string
    needsWindowObject?: boolean
  }
}
```
假设我们在项目中使用 `antd` 设计系统组件。但 `antd` 单独导出所有组件的 css。需要全局添加样式表才能使组件正确呈现。
```json
{
"root": {
  "importDefinitions": {
    "antdCSS": {
      "type": "package",
      "path": "antd/dist/antd.css",
      "version": "^4.5.1",
      "meta": {
        "importJustPath": true // importJustPath 用于仅添加导入，但不将它们添加到 package.json 字段。
      }
    }
  }
}
}
```

#### `styleSetDefinitions`
用于定义项目样式表。
```json
{
"root": {
  "styleSetDefinitions": {
    "1234": {
        "id": "1234",
        "name": "primary-button",
        "type": "reusable-project-style-map",
        "conditions": [
          { "type": "screen-size",
            "meta": {
              "maxWidth": 991
            },
            "content": {
              "background": "blue"
            }
          }
        ],
        "content": {
          "background": "green",
          "width": "auto",
          "color": "#fff",
          "border": "1px solid #fff"
        }
      },
  }
}
}
```

### 项目UIDL
项目UIDL 是组件UIDL 的集合。

定义：
```ts
interface ProjectUIDL {
  name: string;
  globals: {
    settings: {
      title: string;
      language: string;
    };
    meta: Array<Record<string, string>>;
    assets: GlobalAsset[];
    manifest?: WebManifest;
  };
  root: ComponentUIDL;
  components?: Record<string, ComponentUIDL>;
}
```

## 校验
核心包: `teleport-uidl-validator`
### 解码器（Decoder）
解码器是 UIDL 中所有单个节点的小型验证器。例如，我们可以使用 `styleValueDecoder` 验证样式，并且可以使用 `attributeValueDecoder` 单独验证属性。所有可用的解码器都可以在 [decoders utils](https://github.com/teleporthq/teleport-code-generators/blob/development/packages/teleport-uidl-validator/src/decoders/utils.ts) 中找到。

## 组件生成器
组件生成器将 组件UIDL 转换为内存文件列表。实现组件生成算法的核心包是 `teleport-component-generator`。
```ts title="packages/teleport-component-generator/src/index.ts"
const createComponentGenerator = ({
  mappings = [],
  plugins = [],
  postprocessors = [],
}: Omit<GeneratorFactoryParams, 'variation'> = {}): ComponentGenerator => {
  const validator = new Validator()
  const resolver = new Resolver([HTMLMapping, ...mappings])
  const assemblyLine = new AssemblyLine(plugins)
  const chunksLinker = new Builder()
  const processors: PostProcessor[] = postprocessors

  const generateComponent = async (
    input: Record<string, unknown>,
    options: GeneratorOptions = {}
  ): Promise<CompiledComponent> => {
    // ...
  }

  const linkCodeChunks = (chunks: Record<string, ChunkDefinition[]>, fileName: string) => {
    // ...
  }

  const addPostProcessor = (fn: PostProcessor) => {
    processors.push(fn)
  }

  return {
    generateComponent,
    linkCodeChunks,
    resolveElement: resolver.resolveElement.bind(resolver),
    addMapping: resolver.addMapping.bind(resolver),
    addPlugin: assemblyLine.addPlugin.bind(assemblyLine),
    addPostProcessor,
  }
}
```

如下UIDL，我们如何决定将 `text` 转换为 `span`？
```json
{
  "name": "Message",
  "node": {
    "type": "element",

    "content": {
      "elementType": "text",
      "children": [
        {
          "type": "static",
          "content": "Hello World!!"
        }
      ]
    }
  }
}
```
对于 React 或 Vue 应用程序来说，`text` 对应 `span`。但对于 React Native 应用程序，这将对应一个 `<Text>` 标签。我们需要指定一种将通用节点类型映射到框架（和语言）特定内容的方法，即解析器（resolver）

### 解析器
核心包: `teleport-uidl-resolver`

示例：
```js
const myMapping = {
  elements: {
    container: {
      elementType: "div",
    },
  },
  events: {
    click: "onclick",
  },
};

const resolver = new Resolver();
resolver.addMapping(myMapping);

const resolvedUIDL = resolver.resolveUIDL(
  {
    node: {
      type: "element",
      content: {
        elementType: "container",
      },
    },
  },
  options
);
```

### 流水线
源代码: `packages/teleport-component-generator/src/assembly-line/index.ts`
```ts title="packages/teleport-component-generator/src/assembly-line/index.ts"
export default class AssemblyLine {
  private plugins: ComponentPlugin[]

  constructor(plugins: ComponentPlugin[] = []) {
    this.plugins = plugins
  }

  public async run(
    uidl: ComponentUIDL,
    options: GeneratorOptions,
    initialStructure: ComponentStructure = {
      uidl,
      options,
      chunks: [],
      dependencies: {},
    }
  ) {
    // ...
    return {
      chunks,
      externalDependencies,
    }
  }

  public getPlugins() {
    return this.plugins
  }

  public addPlugin(plugin: ComponentPlugin) {
    this.plugins.push(plugin)
  }
}
```

流水线用于添加插件，增强组件的功能。每个插件都会接收 UIDL 以及流水线中之前的插件创建的内容。示例：
```js
const assemblyLine = new AssemblyLine();
assemblyLine.addPlugin(reactComponentPlugin);
assemblyLine.addPlugin(stylePlugin);
assemblyLine.addPlugin(jsxPropTypesPlugin);
assemblyLine.addPlugin(importStatementsPlugin);
```

流水线运行后返回块和外部依赖信息。构建器将使用这些块来生成代码。
```js
const { chunks, externalDependencies } = await assemblyLine.run(resolvedUIDL);
```

### 构建器
```ts title="packages/teleport-component-generator/src/builder/index.ts"
export default class Builder {
  private chunkDefinitions: ChunkDefinition[] = []

  constructor(chunkDefinitions: ChunkDefinition[] = []) {
    this.chunkDefinitions = chunkDefinitions
  }

  public link(chunkDefinitions: ChunkDefinition[] = []): string {
    // ...

    const resultingString: string[] = []

    // ...

    return resultingString.join('\n')
  }
}
```

示例：
```ts
const { chunks, externalDependencies } = await assemblyLine.run(resolvedUIDL);

const chunksLinker = new Builder();
const jsCode = chunksLinker.link(chunks.default);
const file = createFile(fileName, FILE_TYPE.JS, jsCode);
```

### 映射


官方的 React 映射在 `@teleporthq/teleport-component-generator-react` 中维护



### 插件
:::
插件按照添加的确切顺序进行调用。
:::

- `@teleporthq/teleport-plugin-import-statements` 将处理需要生成的所有导入语句，包括本地依赖项以及项目或库依赖项


### 自定义组件生成器
[例子](https://codesandbox.io/p/sandbox/custom-component-generator-7sej7?file=%2Fsrc%2Findex.js)

## 项目生成器
`@teleporthq/teleport-project-generator-next` 用于生成一个Next.js项目