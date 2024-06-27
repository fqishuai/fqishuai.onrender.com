JSON Schema 是一种用于验证和描述 JSON 数据结构的规范。它允许你定义 JSON 数据的结构、类型、格式和约束，从而确保数据的完整性和一致性。JSON Schema 可以用于数据验证、文档生成、代码生成等多种用途。

### JSON Schema 基本结构

一个 JSON Schema 通常包含以下几个部分：

1. **`$schema`**：指定使用的 JSON Schema 版本。
2. **`type`**：定义数据的类型，例如 `object`、`array`、`string`、`number` 等。
3. **`properties`**：定义对象的属性及其类型和约束。
4. **`required`**：指定哪些属性是必需的。
5. **`items`**：定义数组的元素类型和约束。
6. **`additionalProperties`**：控制对象是否允许额外的属性。

### 示例

下面是一个简单的 JSON Schema 示例，用于描述一个用户对象：

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "name": {
      "type": "string"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "age": {
      "type": "integer",
      "minimum": 0
    },
    "isActive": {
      "type": "boolean"
    }
  },
  "required": ["id", "name", "email"]
}
```

### 解释

- **`$schema`**：指定使用的 JSON Schema 版本，这里使用的是 Draft 07。
- **`type`**：定义数据类型为 `object`。
- **`properties`**：定义对象的属性：
  - `id`：类型为 `integer`。
  - `name`：类型为 `string`。
  - `email`：类型为 `string`，并且格式为 `email`。
  - `age`：类型为 `integer`，并且最小值为 0。
  - `isActive`：类型为 `boolean`。
- **`required`**：指定 `id`、`name` 和 `email` 是必需的属性。

### 使用 JSON Schema 进行验证

你可以使用各种库来根据 JSON Schema 验证 JSON 数据。例如，在 JavaScript 中，你可以使用 `ajv` 库：

```bash
npm install ajv
```

然后在代码中使用：

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "name": {
      "type": "string"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "age": {
      "type": "integer",
      "minimum": 0
    },
    "isActive": {
      "type": "boolean"
    }
  },
  "required": ["id", "name", "email"]
};

const data = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  age: 30,
  isActive: true
};

const validate = ajv.compile(schema);
const valid = validate(data);

if (valid) {
  console.log('Data is valid');
} else {
  console.log('Data is invalid:', validate.errors);
}
```

通过这种方式，你可以使用 JSON Schema 来确保 JSON 数据的结构和内容符合预期。