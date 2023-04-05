---
slug: callbacks
tags: [js-core]
---

## [JavaScript Callbacks](https://www.javascripttutorial.net/javascript-callback/)
:::tip
By definition, a callback is a function that you pass into another function as an argument for executing later. 回调是一个函数，作为另一个函数的参数，用于以后执行。
:::

```js
function filter(numbers) {
  let results = [];
  for (const number of numbers) {
    if (number % 2 != 0) {
      results.push(number);
    }
  }
  return results;
}
let numbers = [1, 2, 4, 7, 3, 5, 6];
console.log(filter(numbers));
```

为了使filter()更通用和可复用（more generic and reusable），增加一个入参用于判断，我一般是使用一个“type”，但是使用一个函数作为入参可能更灵活:
```js
function isOdd(number) {
  return number % 2 != 0;
}
function isEven(number) {
  return number % 2 == 0;
}

function filter(numbers, fn) {
  let results = [];
  for (const number of numbers) {
    if (fn(number)) {
      results.push(number);
    }
  }
  return results;
}
let numbers = [1, 2, 4, 7, 3, 5, 6];

console.log(filter(numbers, isOdd));
console.log(filter(numbers, isEven));
```
By definition, the `isOdd` and `isEven` are `callback functions` or `callbacks`. Because the `filter()` function accepts a function as an argument, it’s called a `high-order function`. 高阶函数
> A high-order function is a function that accepts another function as an argument.

A callback can be an anonymous function, which is a function without a name. 回调可以是匿名函数，它是没有名称的函数。
```js
function filter(numbers, callback) {
  let results = [];
  for (const number of numbers) {
    if (callback(number)) {
      results.push(number);
    }
  }
  return results;
}

let numbers = [1, 2, 4, 7, 3, 5, 6];

let oddNumbers = filter(numbers, function (number) {
  return number % 2 != 0;
});

console.log(oddNumbers);
```

In ES6, you can use an arrow function:
```js
function filter(numbers, callback) {
  let results = [];
  for (const number of numbers) {
    if (callback(number)) {
      results.push(number);
    }
  }
  return results;
}

let numbers = [1, 2, 4, 7, 3, 5, 6];

let oddNumbers = filter(numbers, (number) => number % 2 != 0);

console.log(oddNumbers);
```

There are two types of callbacks: synchronous and asynchronous callbacks. 回调有两种类型：同步回调和异步回调。

### Synchronous callbacks
A synchronous callback is executed during the execution of the high-order function that uses the callback. 同步回调 在高阶函数(其入参中有该回调的函数) 执行期间 执行。

### Asynchronous callbacks
:::tip
Asynchronicity means that if JavaScript has to wait for an operation to complete, it will execute the rest of the code while waiting. 异步性意味着如果 JavaScript 必须等待操作完成，它将在等待期间执行其余代码。

Note that JavaScript is a single-threaded programming language. It carries asynchronous operations via the callback queue and event loop. 请注意，JavaScript 是一种单线程编程语言。它通过回调队列和事件循环进行异步操作。
:::
An asynchronous callback is executed after the execution of the high-order function that uses the callback. 异步回调 在高阶函数(其入参中有该回调的函数) 执行之后 执行。
```js
function download(url, callback) {
  setTimeout(() => {
    // script to download the picture here
    console.log(`Downloading ${url} ...`);
    // process the picture once it is completed
    callback(url);
  }, 1000);
}

let url = 'https://www.javascripttutorial.net/pic.jpg';
download(url, function(picture) {
  console.log(`Processing ${picture}`);
}); 
```

Handling errors: 引入两个回调分别处理成功和失败情况
```js
function download(url, success, failure) {
  setTimeout(() => {
    console.log(`Downloading the picture from ${url} ...`);
    !url ? failure(url) : success(url);
  }, 1000);
}

download(
  '',
  (url) => console.log(`Processing the picture ${url}`),
  (url) => console.log(`The '${url}' is not valid`)
);
```

不使用callback:
```js
function getUsers() {
  let users = [];
  setTimeout(() => {
    users = [
      { username: 'john', email: 'john@test.com' },
      { username: 'jane', email: 'jane@test.com' },
    ];
  }, 1000);
  return users;
}

function findUser(username) {
  const users = getUsers(); // []
  const user = users.find((user) => user.username === username);
  return user;
}

console.log(findUser('john')); // undefined
```

使用callback:
```js
function getUsers(callback) {
  setTimeout(() => {
    callback([
      { username: 'john', email: 'john@test.com' },
      { username: 'jane', email: 'jane@test.com' },
    ]);
  }, 1000);
}

function findUser(username, callback) {
  getUsers((users) => {
    const user = users.find((user) => user.username === username);
    callback(user);
  });
}

findUser('john', console.log); // { username: 'john', email: 'john@test.com' }
```

### Nesting callbacks and the Pyramid of Doom 嵌套回调和厄运金字塔
How do you download three pictures and process them sequentially? A typical approach is to call the download() function inside the callback function. 如何下载三张图片并依次处理？一种典型的方法是在回调函数中调用 download() 函数
```js
function download(url, callback) {
  setTimeout(() => {
    console.log(`Downloading ${url} ...`);
    callback(url);
  }, 1000);
}

const url1 = 'https://www.javascripttutorial.net/pic1.jpg';
const url2 = 'https://www.javascripttutorial.net/pic2.jpg';
const url3 = 'https://www.javascripttutorial.net/pic3.jpg';

download(url1, function (url) {
  console.log(`Processing ${url}`);
  download(url2, function (url) {
    console.log(`Processing ${url}`);
    download(url3, function (url) {
      console.log(`Processing ${url}`);
    });
  });
});
```

However, this callback strategy does not scale well when the complexity grows significantly. 然而，当复杂性显着增加时，这种回调策略无法很好地扩展。

Nesting many asynchronous functions inside callbacks is known as the `pyramid of doom` or the `callback hell`. 在回调中嵌套许多异步函数被称为厄运金字塔或回调地狱。

To avoid the pyramid of doom, you use `promises` or `async/await` functions.