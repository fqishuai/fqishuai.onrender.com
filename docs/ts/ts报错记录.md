---
slug: ts-error
tags: [ts, 记录]
---

### 1. [Argument of type not assignable to parameter type 'never'](https://bobbyhadz.com/blog/typescript-argument-type-not-assignable-parameter-type-never)

当我们声明一个空数组而没有显式键入它并尝试向其中添加元素时，会出现错误“类型的参数不能分配给‘never’类型的参数”。要解决该错误，请显式键入空数组，比如：`const arr: string[] = [];`

### 2. ['this' implicitly has type 'any' error in TypeScript](https://bobbyhadz.com/blog/typescript-this-implicitly-has-type-any)

当我们在类之外或在无法推断 this 类型的函数中使用 this 关键字时，会出现“this 隐式具有任何类型”的错误。要解决此错误，请将 this 关键字的类型添加为函数中的第一个参数。

### 3. [Variable 'X' is used before being assigned in TypeScript](https://bobbyhadz.com/blog/typescript-variable-is-used-before-being-assigned)

当我们声明一个变量而不为其赋值或仅在满足条件时才赋值时，会出现错误“变量在赋值之前使用”。要解决该错误，请将变量的类型更改为可能未定义或给它一个初始值。

### 4. [This expression is not callable. Type 'X' no call signatures](https://bobbyhadz.com/blog/typescript-this-expression-not-callable-type-has-no-call-signatures)

当我们尝试将不是函数的类型调用为函数或作为其他类型键入为函数时，会发生 TypeScript 错误: “此表达式不可调用。类型 'X' 没有调用签名”。要解决此错误，请确保您正在调用一个函数并且它是作为函数输入的。

### 5. [Using DayJS with Typescript](https://issuehunt.io/r/iamkun/dayjs/issues/788)
```jsx
import { default as dayjs } from 'dayjs';

import dayjs = require('dayjs');
```

### 6. [Binding element 'X' implicitly has an 'any' type](https://bobbyhadz.com/blog/typescript-binding-element-implicitly-has-an-any-type)

The error "Binding element implicitly has an 'any' type" occurs when we don't set the type of an object parameter in a function. The issue is that the functions take an object as a parameter, we destructure the object's properties, but don't type the object. To solve the error, make sure to explicitly type the object parameter of the function. 当我们没有在函数中设置对象参数的类型时，会出现“绑定元素隐式具有‘任何’类型”的错误。问题是函数将对象作为参数，我们解构对象的属性，但不键入对象。要解决该错误，请确保明确键入函数的对象参数。

```ts
// 👇️ With Functions 👇️
// ⛔️ Error: Binding element 'id' implicitly has an 'any' type.ts(7031)
function getEmployee({ id, name }) {
  return { id, name };
}

// 👇️ With Class methods 👇️
class Employee {
  id: number;
  name: string;

  // ⛔️ Error: Binding element 'name' implicitly has an 'any' type.ts(7031)
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }
}

// To solve the error, type the object by separating the object parameter and its type by a colon.
// 要解决该错误，请通过用冒号分隔对象参数及其类型来键入对象。
// 👇️ With Functions 👇️
function getEmployee({ id, name }: { id: number; name: string }) {
  return { id, name };
}

// 👇️ With class methods 👇️
class Employee {
  id: number;
  name: string;

  constructor({ id, name }: { id: number; name: string }) {
    this.id = id;
    this.name = name;
  }
}

```

### 7. [Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'](https://bobbyhadz.com/blog/typescript-element-implicitly-has-any-type-expression)

- keyof
- typeof
```ts
const str = 'name' as string;

const obj = {
  name: 'Bobby Hadz',
  country: 'Chile',
};

// ⛔️ Error: Element implicitly has an 'any' type
// because expression of type 'string' can't be used
// to index type '{ name: string; }'.
// No index signature with a parameter of type 'string'
// was found on type '{ name: string; }'.ts(7053)
obj[str];

// 使用keyof typeof解决
const str = 'name' as string;

const obj = {
  name: 'Bobby Hadz',
  country: 'Chile',
};

// 👇️ "Bobby Hadz"
console.log(obj[str as keyof typeof obj]);

// 👇️ type T = "name" | "country"
type T = keyof typeof obj;

// 使用keyof解决
const str = 'name' as string;

interface Person {
  name: string;
  country: string;
}

const obj: Person = {
  name: 'Bobby Hadz',
  country: 'Chile',
};

console.log(obj[str as keyof Person]); // 👉️ "Bobby Hadz"

// 👇️ type T = "name" | "country"
type T = keyof Person;

```

### 8. [Property 'value' does not exist on type 'HTMLElement'](https://bobbyhadz.com/blog/typescript-property-value-not-exist-type-htmlelement)

The error "Property 'value' does not exist on type 'HTMLElement'" occurs when we try to access the value property on an element that has a type of HTMLElement. The reason we got the error is that the return type of the document.getElementById method is `HTMLElement | null` and the `value` property doesn't exist in the HTMLElement type. To solve the error, use a type assertion to type the element as HTMLInputElement (or HTMLTextAreaElement if you're typing a textarea element) before accessing the property. 当我们尝试访问具有 HTMLElement 类型的元素的 value 属性时，会出现错误“属性‘value’在类型‘HTMLElement’上不存在”。我们得到错误的原因是 document.getElementById 方法的返回类型是 `HTMLElement | null` 并且 value 属性在 HTMLElement 类型中不存在。要解决该错误，请在访问该属性之前使用类型断言将元素断言为 HTMLInputElement（或者 对于textarea元素 断言为 HTMLTextAreaElement）。

```ts
// 👇️ const input: HTMLElement | null
const input = document.getElementById('first_name');

if (input != null) {
  // ⛔️ Error: Property 'value' does not exist on type 'HTMLElement'.ts(2339)
  const value = input.value;
}

// 断言为HTMLInputElement
const input = document.getElementById('first_name') as HTMLInputElement | null;

// 👇️ using optional chaining (?.)
const value = input?.value;

console.log(value); // 👉️ Initial value
```

### 9. `allowImportingTsExtensions`
Allow imports to include TypeScript file extensions. Requires '--moduleResolution bundler' and either '--noEmit' or '--emitDeclarationOnly' to be set.

### 10. `allowSyntheticDefaultImports`

### 11. `strict`

### 12. [No index signature with a parameter of type 'string' was found on type](https://bobbyhadz.com/blog/typescript-no-index-signature-with-parameter-of-type-string)

```ts
const key = 'country' as string;

const obj = {
  name: 'Bobby Hadz',
  country: 'Germany',
};

// ⛔️ Error:  No index signature with a parameter of type
// 'string' was found on type '{ name: string; country: string; }'.ts(7053)
console.log(obj[key]);

// 使用类型断言来解决错误
console.log(obj[key as keyof typeof obj]);
```

### 13. [Property 'X' does not exist on type 'Y'](https://www.totaltypescript.com/concepts/property-does-not-exist-on-type)

```ts
const requestParam = {
  userName,
  phoneNumber: phone,
};

if (addressIdValue) requestParam.userAddressId = addressIdValue; // Property 'userAddressId' does not exist on type '{ userName: string; phoneNumber: string; }'.
```

使用 `Record` 解决上述问题：
```ts
const requestParam: Record<string, string | null | undefined> = {
  userName,
  phoneNumber: phone,
};

if (addressIdValue) requestParam.userAddressId = addressIdValue;
```

### 14. 自定义样式属性导致类型不匹配
```ts
<Switch  
  style={{ '--nutui-switch-open-background-color': '#FF6300' }} // ts报错：Type '{ '--nutui-switch-open-background-color': string; }' is not assignable to type 'Properties<string | number, string & {}>'.
  checked={defaultAddressFlag}
  onChange={(value) => setDefaultAddressFlag(value)}
/>
```
解决方案有3种：
1. 使用类型断言
   ```ts
   <Switch
     style={{ '--nutui-switch-open-background-color': '#FF6300' } as React.CSSProperties}
     checked={defaultAddressFlag}
     onChange={(value) => setDefaultAddressFlag(value)}
   />
   ```

2. 使用模块合并（module merging）的方式来扩展类型定义，以便让 TypeScript 正确识别自定义样式属性。
   ```ts
   import 'react';

   declare module 'react' {
      interface CSSProperties {
        '--nutui-switch-open-background-color': string;
      }
   }
   ```

3. 使用接口继承或交叉类型来扩展类型定义。
   ```ts
   // 接口继承
   interface CustomCSSProperties extends React.CSSProperties {
     '--nutui-switch-open-background-color': string;
   }
   ```
   ```ts
   // 交叉类型
   type CustomCSSProperties = React.CSSProperties & {
     '--nutui-switch-open-background-color': string;
   };
   ```

### 15. change target library
- 使用字符串的`startsWith`方法报错：Property `'startsWith'` does not exist on type `'Extract<keyof P, string>'`. Do you need to change your target library? Try changing the `'lib'` compiler option to `'es2015'` or later.

- 使用`console`方法报错：Cannot find name `'console'`. Do you need to change your target library? Try changing the `'lib'` compiler option to include `'dom'`.

### 16. 缺少类型声明
`Cannot find module './index.less' or its corresponding type declarations.` 解决办法：在指定的类型声明文件中对`less`文件进行类型声明。

在`tsconfig.json`文件中通过`compilerOptions.typeRoots`指定类型声明文件
```json title="tsconfig.json"
"compilerOptions": {
  "typeRoots": ["./src/typings", "./node_modules/@types"],
}
```

在`src/typings/index.d.ts`中对`less`文件进行类型声明
```ts title="src/typings/index.d.ts"
declare module '*.less' {
  const value: {
    [key: string]: string
  }
  export = value
}
```

### 17. ts中使用CSS Modules
> [Setting up CSS Modules in Typescript project](https://medium.com/@dimi_2011/setting-up-css-modules-in-typescript-project-52596526d19)

1. `npm install --save-dev typescript-plugin-css-modules`

2. 在指定的类型声明文件中对`.module.css`文件进行类型声明：`declare module "*.module.css";`

3. 在`tsconfig.json`文件中配置plugins：
   ```json title="tsconfig.json"
   {
     "compilerOptions": {
       "plugins": [{ "name": "typescript-plugin-css-modules" }],
     },
   }
   ```

### 18. 指定target
使用[对象的访问器属性](https://zh.javascript.info/property-accessors)报错：`Accessors are only available when targeting ECMAScript 5 and higher.` 解决办法：设置`compilerOptions.target`为`'ES6'`
```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES6"
  }
}
```

### 19. [Property does not exist on type 'never' in TypeScript](https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type-never)
解决办法：
- 使用 `obj['myProperty']` 替代 `obj.myProperty`

- 使用断言，比如`(employee as Employee).salary`

React中，当没有声明`useState`定义的state的类型或者没有声明`useRef`的返回值类型时，会报`Property does not exist on type 'never' in TypeScript`
```tsx
import {useEffect, useRef} from 'react';

const ComponentA = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    // ⛔️ Error: Property 'focus' does not exist on type 'never'.ts(2339)
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <input ref={inputRef} />
    </div>
  );
};
```
解决办法，使用泛型:

使用泛型声明`useRef`的返回值类型
```tsx
import {useEffect, useRef} from 'react';

const ComponentA = () => {
  // 👇️ type the ref as HTML input element
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // ✅ Works now
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <input ref={inputRef} />
    </div>
  );
};
```

使用泛型声明`useState`定义的state的类型
```tsx
import {useState} from 'react';

function App() {
  // 👇️ type it as string[]
  const [strArr, setStrArr] = useState<string[]>([]);

  // 👇️ type it as object array
  const [objArr, setObjArr] = useState<{name: string; age: number}[]>([]);

  return (
    <div className="App">
      <div>Hello world</div>
    </div>
  );
}

export default App;
```

### 20. `No index signature with a parameter of type 'string' was found on type '{ CHANGE_ASSIGN_NEW: string; CHANGE_RESERVE_NEW: string; }'.`
这个错误通常出现在你尝试通过字符串索引访问一个对象的属性，但该对象的类型没有定义相应的索引签名时。为了更好地理解和解决这个问题，我们需要先了解索引签名和对象类型。

假设你有一个对象，其中包含一些字符串常量：

```typescript
const actionTypes = {
  CHANGE_ASSIGN_NEW: 'CHANGE_ASSIGN_NEW',
  CHANGE_RESERVE_NEW: 'CHANGE_RESERVE_NEW',
} as const;
```

并且你想要通过字符串索引来访问这些属性：

```typescript
function getActionType(action: string): string {
  return actionTypes[action];
}
```

但是上面这种用法会导致 `No index signature with a parameter of type 'string' was found on type` 错误，因为 `actionTypes` 的类型没有定义字符串索引签名。


有几种方法可以解决这个问题：

#### 方法一：使用 TypeScript 的类型断言

你可以显式地告诉 TypeScript 这个对象可以通过字符串索引访问：

```typescript
const actionTypes = {
  CHANGE_ASSIGN_NEW: 'CHANGE_ASSIGN_NEW',
  CHANGE_RESERVE_NEW: 'CHANGE_RESERVE_NEW',
} as const;

function getActionType(action: keyof typeof actionTypes): string {
  return actionTypes[action];
}
```

在这里，我们使用 `keyof typeof actionTypes` 来确保 `action` 参数只能是 `actionTypes` 对象中的键。

#### 方法二：使用类型定义

你可以为对象定义一个索引签名：

```typescript
type ActionTypes = {
  [key: string]: string;
};

const actionTypes: ActionTypes = {
  CHANGE_ASSIGN_NEW: 'CHANGE_ASSIGN_NEW',
  CHANGE_RESERVE_NEW: 'CHANGE_RESERVE_NEW',
};

function getActionType(action: string): string {
  return actionTypes[action];
}
```

这种方法定义了一个通用的索引签名，允许通过字符串索引访问对象的属性。

#### 方法三：使用枚举

如果你希望更严格的类型检查，可以使用 TypeScript 的枚举：

```typescript
enum ActionTypes {
  CHANGE_ASSIGN_NEW = 'CHANGE_ASSIGN_NEW',
  CHANGE_RESERVE_NEW = 'CHANGE_RESERVE_NEW',
}

function getActionType(action: ActionTypes): string {
  return action;
}

// 使用
const actionType = getActionType(ActionTypes.CHANGE_ASSIGN_NEW);
console.log(actionType); // 输出: "CHANGE_ASSIGN_NEW"
```

使用枚举可以确保传递给 `getActionType` 的参数是有效的 `ActionTypes` 枚举值。
