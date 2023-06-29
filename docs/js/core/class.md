---
slug: class
tags: [js-core]
---

## [JavaScript Classes – How They Work with Use Case Example](https://www.freecodecamp.org/news/javascript-classes-how-they-work-with-use-case/)
- JavaScript still follows a prototype-based inheritance model. Classes in JavaScript are syntactic sugar over the prototype-based inheritance model which we use to implement OOP concepts. JavaScript 仍然遵循基于原型的继承模型。 JavaScript 中的类是我们用来实现 OOP 概念的基于原型的继承模型的语法糖。

- Before classes, we used constructor functions to do OOP in JavaScript. class被引入（[EcmaScript 2015](https://262.ecma-international.org/6.0/) (ES6) ）之前，使用构造函数在 JavaScript 中进行 OOP。
```js
// Pen Constructor function
function Pen(name, color, price) {
  this.name = name;
  this.color = color;
  this.price = price;
}

const pen1 = new Pen("Marker", "Blue", "$3");
console.log(pen1);

/**
 * we want to add a new function to the Pen constructor.
 * To do this we need to add the function into the prototype property of Pen.
*/
Pen.prototype.showPrice = function(){
  console.log(`Price of ${this.name} is ${this.price}`);
}

pen1.showPrice();
```
- We can re-create the above example with the help of the `class` keyword.
```js
class Pen {
  constructor(name, color, price){
    this.name = name;
    this.color = color; 
    this.price = price;
  }
  
  showPrice(){
    console.log(`Price of ${this.name} is ${this.price}`);
  }
}

const pen1 = new Pen("Marker", "Blue", "$3");
pen1.showPrice();
```

- attributes、abstract functions
<CodeRun>
{
  `
  class Chair {
    constructor(color, seatHeight, recliningAngle, backSupport, headSupport, padding, armRests, seatSize, isHeightAdjustable, isMovable){
      // attributes
      this.color = color;
      this.seatHeight = seatHeight;
      this.recliningAngle = recliningAngle;
      this.backSupport = backSupport;
      this.headSupport = headSupport;
      this.padding = padding;
      this.armRests = armRests;
      this.seatSize = seatSize;
      this.isHeightAdjustable = isHeightAdjustable;
      this.isMovable = isMovable;
    }
    
    // abstract functions
    adjustableHeight() {};
    adjustAngle(){};
    moveChair(){};    
  }
  const newChair = new Chair("Blue","25 inch","20 deg",true,false,"3 inch",true,"16 inch",false,false);
  console.dir("Chair Prototype", Chair);
  console.log("Chair Object", newChair);
  `
}
</CodeRun>

- `extends`、`super()`

## [An Easy Guide To Understanding Classes In JavaScript](https://dev.to/lawrence_eagles/an-easy-guide-to-understanding-classes-in-javascript-3bcm)
- classes are Functions
<CodeRun>
{
  `
  class Person {
    constructor(name, gender) {
      this.name = name;
      this.logo = gender;
    }
  }
  const p1 = new Person('Jack', 'man');
  console.log("Person class", Person) 
  console.log("Person prototype", Person.__proto__)
  console.log("Person prototype --->", Person.__proto__ === Function.prototype)
  console.log("p1 prototype", p1.__proto__ === Person.prototype)
  console.log("Person prototype prototype", Person.prototype.__proto__ === Object.prototype)
  `
}
</CodeRun>

- All three methods below are valid ways to implement a class in JavaScript.
```js
// A class declaration
class Person_Dec {
  constructor(name, gender) {
    this.name = name;
    this.logo = gender;
  }
}

// An Unnamed class expression
const Person_Exp = {
  constructor(name, gender) {
    this.name = name;
    this.logo = gender;
  }
}

// Named class expression
const Person_Exp2 = class Person_Exp {
  constructor(name, gender) {
    this.name = name;
    this.logo = gender;
  }
}
```

- classes are Objects
> 在 JavaScript 中，Class 是一个特殊的函数，JavaScript 中的所有函数都是对象，因此 JavaScript 类是一个对象。 JavaScript 仍然使用原型继承。然而，类提供了一种新的和改进的方法来设置对象原型。

- 将 `static` 关键字与方法一起使用，可以为该类创建一个静态方法。**静态方法不能被类的实例继承，因此不能用类的实例调用它们。** Static methods aren't called on instances of the class. Instead, they're called on the class itself. 但是可以用该类的子类直接调用。
<CodeRun>
{
  `
  class Person {
    constructor(name) {
      this.name = name;
    }
    static logGreeting() {
      console.log("Good day " + this.name);
    }
    sayName() {
      console.log("My name is " + this.name);
    }
  }
  class Developer extends Person {
    constructor(name) {
      super(name);
      this.name = name;
    }
    getBio() {
      super.sayName();
      console.log("I am a developer");
    }
  }
  const ReactGuy = new Person("Lawrence Eagles")
  console.log("Developer Prototype --->", Object.getPrototypeOf(Developer))
  // calls the logGreeting static method of the Person Class in the developer subclass
  console.log("greeting from developer --->", Developer.logGreeting()) // undefined
  // console.log("greeting from developer", ReactGuy.logGreeting())
  `
}
</CodeRun>

- `super`。The `super` keyword is used to **access** and **call functions** on an object's parent.
  - `super.x`. access the property of the parent class
  - `super()`. Calling `super()` method inside the constructor of a subclass would call the constructor of the parent class.
<CodeRun>
{
  `
  class Person {
    constructor(name) {
      this.name = name;
    }
    sayName() {
      console.log("My name is " + this.name);
    }
  }
  class Developer extends Person {
    constructor(name) {
      super(name);
      this.name = name;
    }
    getBio() {
      super.sayName();
      console.log("I am a developer");
    }
  }
  let ReactGuy = new Developer("Lawrence Eagles");
  ReactGuy.getBio();
  `
}
</CodeRun>

:::tip
子类constructor使用`this`前必须调用`super`方法。The `super` method must be called in the constructor in a class before the `this` keyword is made available else we get a reference error.
:::

<CodeRun>
{
  `
  class ObjectFactory {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }
  }
  class Square extends ObjectFactory {
    constructor(length) {
      super(length, length);
    }
  }
  const Square1 = new Square()
  const Square2 = new Square(4)
  console.log("Square1", Square1)
  console.log("Square2", Square2)
  `
}
</CodeRun>

- classes在实际中的应用
```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```