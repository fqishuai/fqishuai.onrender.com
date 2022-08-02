---
slug: usage
tags: [原生js]
---

## 一、API
### 1. Object.fromEntries
:::note
Object.fromEntries() 方法接收一个键值对的列表参数，并返回一个带有这些键值对的新对象。这个迭代参数应该是一个能够实现@@iterator方法的的对象，返回一个迭代器对象。它生成一个具有两个元素的类数组的对象，第一个元素是将用作属性键的值，第二个元素是与该属性键关联的值。
Object.fromEntries() 执行与 Object.entries 互逆的操作。
:::
```js
// Map 转化为 Object
const map = new Map([ ['foo', 'bar'], ['baz', 42] ]);
const obj = Object.fromEntries(map);
console.log(obj); // { foo: "bar", baz: 42 }

// Array 转化为 Object
const arr = [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ];
const obj = Object.fromEntries(arr);
console.log(obj); // { 0: "a", 1: "b", 2: "c" }
```

## 二、手写函数
### 1. 去重
```js
/**
 * 去重
 */
handleDeduplicate(sourceArray,keyName) {
  let deduplicationList = [];
  let obj = {};
  for (let item of sourceArray) {
    if (!obj[item[keyName]]) {
      deduplicationList.push(item);
      obj[item[keyName]] = 1;
    }
  }
  return deduplicationList;
},
```

### 2. 循环删数组元素
```js
var arr = [1,2,2,3,4,5];
var i = arr.length;
// 从后往前遍历
while(i--){
  if(arr[i]==2){
    arr.splice(i,1);
  }
}
console.log(arr);
```
> 也可以使用filter实现
```js
var stuArr = [
  {name:'Jesse',gender:'male'},
  {name:'Leo',gender:'male'},
  {name:'Sophia',gender:'female'},
  {name:'Kathy',gender:'female'},
  {name:'Gaviin',gender:'male'}
];

stuArr = stuArr.filter(function(item){
  return item.gender !== 'male';
})
// 运行结果，删除后数组当前值
[
  {name:'Sophia',gender:'female'},
  {name:'Kathy',gender:'female'},
]
```

### 3. 使用weakmap实现深拷贝
```js
/**
 * 使用weakmap手写深拷贝
 */
deepClone(obj, hash = new WeakMap()) {
  const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null);
  if (obj.constructor === Date) return new Date(obj);
  if (obj.constructor === RegExp) return new RegExp(obj);
  if (hash.has(obj)) return hash.get(obj);
  let allDesc = Object.getOwnPropertyDescriptor(obj);
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);
  hash.set(obj, cloneObj);
  for (const key of Reflect.ownKeys(obj)) {
    cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? this.deepClone(obj[key], hash) : obj[key];
  }
  return cloneObj;
},
```

### 4. 数组转树；树转数组