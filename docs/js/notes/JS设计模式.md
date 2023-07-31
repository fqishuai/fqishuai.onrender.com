---
slug: design-patterns
tags: [读书笔记]
---

## 面向对象
### 动态类型语言和鸭子类型
- JavaScript 是通过原型委托的方式来实现对象与对象之间的继承。
- 静态类型语言在编译时便已确定变量的类型，而动态类型语言的变量类型要到程序运行的时候，待变量被赋予某个值之后，才会具有某种类型。JavaScript是一门典型的动态类型语言。
- 鸭子类型：只关注对象的行为，而不关注对象本身。在动态类型语言的面向对象设计中，鸭子类型的概念至关重要。
- “面向接口编程”是设计模式中最重要的思想

### 多态
- 多态的实际含义是：**同一操作作用于不同的对象上面，可以产生不同的解释和不同的执行结果。** 换句话说，给不同的对象发送同一个消息的时候，这些对象会根据这个消息分别给出不同的反馈。

- **多态背后的思想是将 “做什么” 和 “谁去做以及怎样去做” 分离开来，也就是将 “不变的事物” 与 “可能改变的事物” 分离开来**(动物都会叫，这是不变的，但是不同类型的动物具体怎么叫是可变的)。要实现这一点，归根结底先要消除类型之间的耦合关系。在Java中，可以通过向上转型来实现多态。而JavaScript对象的多态性是与生俱来的，因为JavaScript作为一门动态类型语言，它在编译时没有类型检查的过程，既没有检查创建的对象类型，又没有检查传递的参数类型。

- 静态类型的面向对象语言通常被设计为可以向上转型：当给一个类变量赋值时，这个变量的类型既可以使用这个类本身，也可以使用这个类的超类。(当 Duck对象 和 Chicken对象 的类型都被隐藏在 超类型Animal 身后，Duck对象和Chicken对象就能被交换使用，这是让对象表现出多态性的必经之路)

- 使用继承来得到多态效果，是让对象表现出多态性的最常用手段。

- 继承通常包括 实现继承 和 接口继承。
```java
public abstract class Animal {
  abstract void makeSound();   // 抽象方法
}

public class Chicken extends Animal{
  public void makeSound(){
    System.out.println( "咯咯咯" );
  }
}

public class Duck extends Animal{
  public void makeSound(){
    System.out.println( "嘎嘎嘎" );
  }
}

Animal duck = new Duck();
Animal chicken = new Chicken();

public class AnimalSound{
  public void makeSound( Animal animal ){    // 接受Animal 类型的参数
    animal.makeSound();
  }
}

public class Test {
  public static void main( String args[] ){
    AnimalSound animalSound= new AnimalSound ();
    Animal duck = new Duck();
    Animal chicken = new Chicken();
    animalSound.makeSound( duck );    // 输出嘎嘎嘎
    animalSound.makeSound( chicken );        // 输出咯咯咯
  }
}
```

- **把不变的部分隔离出来，把可变的部分封装起来**，这给予了我们扩展程序的能力，程序看起来是可生长的，也是符合开放—封闭原则的，相对于修改代码来说，仅仅增加代码就能完成同样的功能，这显然优雅和安全得多。
```js
/*
优化前
*/
var makeSound = function( animal ){ 
  if ( animal instanceof Duck ){ 
    console.log( '嘎嘎嘎' ); 
  }else if ( animal instanceof Chicken ){ 
    console.log( '咯咯咯' ); 
  } 
}; 
 
var Duck = function(){}; 
var Chicken = function(){}; 
 
makeSound( new Duck() );      // 嘎嘎嘎 
makeSound( new Chicken() );   // 咯咯咯

/*
优化后
*/
// 首先把不变的部分隔离出来
var makeSound = function( animal ){
  animal.sound();
};

// 然后把可变的部分各自封装起来
var Duck = function(){}

Duck.prototype.sound = function(){
  console.log( '嘎嘎嘎' );
};

var Chicken = function(){}

Chicken.prototype.sound = function(){
  console.log( '咯咯咯' );
};

makeSound( new Duck() );        // 嘎嘎嘎
makeSound( new Chicken() );     // 咯咯咯

// 方便扩展，不用改动以前的 makeSound 函数
var Dog = function(){}

Dog.prototype.sound = function(){
  console.log( '汪汪汪' );
}; 

makeSound( new Dog() );     // 汪汪汪
```

- 多态的最根本好处在于，你不必再向对象询问“你是什么类型”而后根据得到的答案调用对象的某个行为。你只管调用该行为就是了，其他的一切多态机制都会为你安排妥当。

- **多态最根本的作用就是通过把过程化的条件分支语句转化为对象的多态性，从而消除这些条件分支语句。**

:::info
举例：

在电影的拍摄现场，当导演喊出“action”时，主角开始背台词，照明师负责打灯光，后面的群众演员假装中枪倒地，道具师往镜头里撒上雪花。在得到同一个消息时，每个对象都知道自己应该做什么。如果不利用对象的多态性，而是用面向过程的方式来编写这一段代码，那么相当于在电影开始拍摄之后，导演每次都要走到每个人的面前，确认它们的职业分工（类型），然后告诉他们要做什么。如果映射到程序中，那么程序中将充斥着条件分支语句。

利用对象的多态性，导演在发布消息时，就不必考虑各个对象接到消息后应该做什么。对象应该做什么并不是临时决定的，而是已经事先约定和排练完毕的。每个对象应该做什么，已经成为了该对象的一个方法，被安装在对象的内部，每个对象负责它们自己的行为。所以这些对象可以根据同一个消息，有条不紊地分别进行各自的工作。
:::

- **将行为分布在各个对象中，并让这些对象各自负责自己的行为，这正是面向对象设计的优点。**

:::info
举例：

假设我们要编写一个地图应用，现在有两家可选的地图API 提供商供我们接入自己的应用。为了让 renderMap 函数保持一定的弹性，我们用一些条件分支来让 renderMap 函数同时支持谷歌地图和百度地图：
```js
var googleMap = {
  show: function(){
    console.log( '开始渲染谷歌地图' );
  }
};

var baiduMap = {
  show: function(){
    console.log( '开始渲染百度地图' );
  }
};

var renderMap = function( type ){
  if ( type === 'google' ){
    googleMap.show();
  }else if ( type === 'baidu' ){
    baiduMap.show();
  }
};
 
renderMap( 'google' );    // 输出：开始渲染谷歌地图
renderMap( 'baidu' );     // 输出：开始渲染百度地图

// 可以看到，虽然 renderMap 函数目前保持了一定的弹性，但这种弹性是很脆弱的，一旦需要替换成搜搜地图，那无疑必须得改动renderMap 函数，继续往里面堆砌条件分支语句。

/**
 * 对象的多态性提示我们，“做什么”和“怎么去做”是可以分开的，
 */
var renderMap = function( map ){
  if ( map.show instanceof Function ){
    map.show();
  }
};

renderMap( googleMap );    // 输出：开始渲染谷歌地图
renderMap( baiduMap );     // 输出：开始渲染百度地图

// 即使以后增加了搜搜地图，renderMap 函数仍然不需要做任何改变
var sosoMap = {
  show: function(){
    console.log( '开始渲染搜搜地图' );
  }
};

renderMap( sosoMap );    // 输出：开始渲染搜搜地图
```

在这个例子中，我们假设每个 地图API 提供展示地图的方法名都是show，在实际开发中也许不会如此顺利，这时候可以借助`适配器模式`来解决问题。
:::

- 绝大部分设计模式的实现都离不开多态性的思想。例如：
  - 在`命令模式`中，请求被封装在一些命令对象中，这使得命令的调用者和命令的接收者可以完全解耦开来，当调用命令的 `execute` 方法时，不同的命令会做不同的事情，从而会产生不同的执行结果。而做这些事情的过程是早已被封装在命令对象内部的，作为调用命令的客户，根本不必去关心命令执行的具体过程。
  - 在`组合模式`中，多态性使得客户可以完全忽略组合对象和叶节点对象之前的区别，这正是组合模式最大的作用所在。对组合对象和叶节点对象发出同一个消息的时候，它们会各自做自己应该做的事情，组合对象把消息继续转发给下面的叶节点对象，叶节点对象则会对这些消息作出真实的反馈。
  - 在`策略模式`中，`Context` 并没有执行算法的能力，而是把这个职责委托给了某个策略对象。每个策略对象负责的算法已被各自封装在对象内部。当我们对这些策略对象发出“计算”的消息时，它们会返回各自不同的计算结果。

- 在JavaScript 这种将函数作为一等对象的语言中，函数本身也是对象，函数用来封装行为并且能够被四处传递。**当我们对一些函数发出“调用”的消息时，这些函数会返回不同的执行结果，这是“多态性”的一种体现，也是很多设计模式在JavaScript中可以用高阶函数来代替实现的原因**。

### 封装
封装的目的是将信息隐藏，封装应该被视为“任何形式的封装”，也就是说，封装不仅仅是隐藏数据，还包括隐藏实现细节、设计细节以及隐藏对象的类型等。

#### 封装数据
- JavaScript只能依赖变量的作用域来实现封装特性，而且只能模拟出public 和private 这两种封装性。
- 除了ECMAScript 6 中提供的 `let` 之外，一般我们通过函数来创建作用域：
<CodeRun>
{
  `
  var myObject = (function(){
    var __name = 'sven';    // 私有（private）变量
    return {
      getName: function(){    // 公开（public）方法
        return __name;
      }
    }
  })();
  console.log( myObject.getName() );    // 输出：sven
  console.log( myObject.__name )     // 输出：undefined
  `
}
</CodeRun>

- 在ECAMScript 6 中，还可以通过 `Symbol` 创建私有属性。

#### 封装实现
- 从封装实现细节来讲，封装使得对象内部的变化对其他对象而言是透明的，也就是不可见的。

- 封装使得对象之间的耦合变松散，对象之间只通过暴露的API 接口来通信。

#### 封装类型
- 封装类型是静态类型语言中一种重要的封装方式。一般而言，封装类型是通过抽象类和接口来进行的。在许多静态语言的设计模式中，想方设法地去隐藏对象的类型，也是促使这些模式诞生的原因之一。比如工厂方法模式、组合模式等。

- 在JavaScript 中，并没有对抽象类和接口的支持。JavaScript 本身也是一门类型模糊的语言。在封装类型方面，JavaScript 没有能力，也没有必要做得更多。

#### 封装变化
:::info
考虑你的设计中哪些地方可能变化，这种方式与关注会导致重新设计的原因相反。它不是考虑什么时候会迫使你的设计改变，而是考虑你怎样才能够在不重新设计的情况下进行改变。这里的关键在于封装发生变化的概念，这是许多设计模式的主题。
:::

- 通过封装变化的方式，把系统中稳定不变的部分和容易变化的部分隔离开来，在系统的演变过程中，我们只需要替换那些容易变化的部分，如果这些部分是已经封装好的，替换起来也相对容易。这可以最大程度地保证程序的稳定性和可扩展性。

### 原型模式
- 原型模式不单是一种设计模式，也被称为一种编程泛型。
- 从设计模式的角度讲，原型模式是用于创建对象的一种模式，找到一个对象，然后通过克隆来创建一个一模一样的对象。

- 既然原型模式是通过克隆来创建对象的，那么很自然地会想到，如果需要一个跟某个对象一模一样的对象，就可以使用原型模式。
:::info
假设我们在编写一个飞机大战的网页游戏。某种飞机拥有分身技能，当它使用分身技能的时候，要在页面中创建一些跟它一模一样的飞机。如果不使用原型模式，那么在创建分身之前，无疑必须先保存该飞机的当前血量、炮弹等级、防御等级等信息，随后将这些信息设置到新创建的飞机上面，这样才能得到一架一模一样的新飞机。如果使用原型模式，我们只需要调用负责克隆的方法，便能完成同样的功能。
:::

- 原型模式的实现关键，是语言本身是否提供了 克隆 方法。ECMAScript5 提供了`Object.create`方法，可以用来克隆对象。
<CodeRun>
{
  `
  var Plane = function(){
    this.blood = 100;
    this.attackLevel = 1;
    this.defenseLevel = 1;
  };
  var plane = new Plane();
  plane.blood = 500;
  plane.attackLevel = 10;
  plane.defenseLevel = 7;
  var clonePlane = Object.create( plane );
  console.log( clonePlane );   // 输出：Object {blood: 500, attackLevel: 10, defenseLevel: 7}
  // 在不支持 Object.create 方法的浏览器中，则可以使用以下代码
  Object.create = Object.create || function( obj ){
    var F = function(){};
    F.prototype = obj;
    return new F();
  }
  `
}
</CodeRun>

:::info
在当前的JavaScript 引擎下，通过`Object.create` 来创建对象的效率并不高，通常比通过构造函数创建对象要慢。此外还有一些值得注意的地方，比如通过设置构造器的`prototype` 来实现原型继承的时候，除了根对象`Object.prototype` 本身之外，任何对象都会有一个原型。而通过 `Object.create( null )` 可以创建出没有原型的对象。
:::

- 原型模式的真正目的并非在于需要得到一个一模一样的对象，而是提供了一种便捷的方式去创建某个类型的对象，克隆只是创建这个对象的过程和手段。

- JavaScript 本身是一门基于原型的面向对象语言，它的对象系统就是使用原型模式来搭建的。在JavaScript 语言中不存在类的概念，对象也并非从类中创建出来的，所有的JavaScript 对象都是从某个对象上克隆而来的。

- **原型编程中的一个重要特性，即当对象无法响应某个请求时，会把该请求委托给它自己的原型。**

- **基于原型链的委托机制就是原型继承的本质**

#### Io语言
:::info
JavaScript 基于原型的面向对象系统参考了 Self 语言和 Smalltalk 语言，为了搞清 JavaScript中的原型，我们本该寻根溯源去瞧瞧这两门语言。但由于这两门语言距离现在实在太遥远，我们不妨转而了解一下另外一种轻巧又基于原型的语言---[Io 语言](https://iolanguage.org/)。
:::

- **如果 A 对象是从 B 对象克隆而来的，那么 B 对象就是 A 对象的原型。**

- Io 和JavaScript 一样，**基于原型链的委托机制就是原型继承的本质**。
:::info
在Io 中，根对象名为Object。通过克隆根对象Object 得到了一个新的Animal 对象，所以Object 就被称为Animal 的原型。克隆Animal 对象得到Dog 对象，Animal 对象是Dog 对象的原型。形成了一条**原型链**：当我们尝试调用Dog 对象的某个方法时，而它本身却没有这个方法，那么 Dog 对象会把这个请求委托给它的原型 Animal 对象，如果 Animal 对象也没有这个属性，那么请求会顺着原型链继续被委托给 Animal 对象的原型 Object 对象，这样一来便能得到继承的效果，看起来就像Animal 是Dog 的“父类”，Object 是Animal 的“父类”。
:::

### JavaScript中的原型继承
原型编程范型至少包括以下基本规则：
- 所有的数据都是对象。
- 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它。
- 对象会记住它的原型。
- 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型。

JavaScript 是如何在这些规则的基础上来构建它的对象系统的:
#### 所有的数据都是对象
- 按照JavaScript 设计者的本意，除了`undefined` 之外，一切都应是对象。为了实现这一目标，`number`、`boolean`、`string` 这几种基本类型数据也可以通过“包装类”的方式变成对象类型数据来处理。

- 我们不能说在 JavaScript 中所有的数据都是对象，但可以说绝大部分数据都是对象。

- JavaScript 中的**根对象**是 `Object.prototype 对象`。`Object.prototype 对象`是一个空的对象。我们在 JavaScript 遇到的每个对象，实际上都是从 `Object.prototype 对象`克隆而来的，`Object.prototype 对象`就是它们的原型。
<CodeRun>
{
  `
  var obj1 = new Object();
  var obj2 = {};
  console.log( 'obj1的原型：', Object.getPrototypeOf( obj1 ) === Object.prototype );    // 输出：true 
  console.log( 'obj2的原型：', Object.getPrototypeOf( obj2 ) === Object.prototype );    // 输出：true
  `
}
</CodeRun>

#### 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它
- 在JavaScript 语言里，我们并不需要关心克隆的细节，因为这是引擎内部负责实现的。我们所需要做的只是显式地调用`var obj1 = new Object()`或者`var obj2 = {}`。此时，引擎内部会从`Object.prototype`上面克隆一个对象出来，我们最终得到的就是这个对象。

- 用 `new` 运算符从构造器中得到一个对象。**JavaScript 的函数既可以作为普通函数被调用，也可以作为构造器被调用。当使用 `new` 运算符来调用函数时，此时的函数就是一个构造器。** 用 `new` 运算符来创建对象的过程，实际上也只是先克隆 `Object.prototype 对象`，再进行一些其他额外操作的过程（JavaScript 是通过克隆Object.prototype 来得到新的对象，但实际上并不是每次都真正地克隆了一个新的对象。从内存方面的考虑出发，JavaScript 还做了一些额外的处理）。
<CodeRun>
{
  `
  function Person( name ){
    this.name = name;
  };
  Person.prototype.getName = function(){
    return this.name;
  };
  var a = new Person( 'sven' )
  console.log( a.name );    // 输出：sven
  console.log( a.getName() );     // 输出：sven
  console.log( Object.getPrototypeOf( a ) === Person.prototype );     // 输出：true
  `
}
</CodeRun>

- 在Chrome 和Firefox 等向外暴露了`对象__proto__属性`的浏览器下，我们可以通过下面这段代码来理解 `new` 运算的过程:
<CodeRun>
{
  `
  function Person( name ){
    this.name = name;
  };
  Person.prototype.getName = function(){
    return this.name;
  };
  var objectFactory = function(){
    var obj = new Object(),    // 从Object.prototype 上克隆一个空的对象
      Constructor = [].shift.call( arguments );    // 取得外部传入的构造器，此例是Person
    
    obj.__proto__ = Constructor.prototype;    // 指向正确的原型
    var ret = Constructor.apply( obj, arguments );    // 借用外部传入的构造器给obj 设置属性
    return typeof ret === 'object' ? ret : obj;     // 确保构造器总是会返回一个对象
  };
  var a = objectFactory( Person, 'sven' );
  console.log( a.name );    // 输出：sven
  console.log( a.getName() );     // 输出：sven
  console.log( Object.getPrototypeOf( a ) === Person.prototype );      // 输出：true
  `
}
</CodeRun>

#### 对象会记住它的原型
- 要完成 JavaScript 语言中的原型链查找机制，每个对象至少应该先记住它自己的原型。
- 就 JavaScript 的真正实现来说，其实**并不能说对象有原型，而只能说对象的构造器有原型**。
- 对于“对象把请求委托给它自己的原型”这句话，更好的说法是对象把请求委托给它的构造器的原型。
- `Object.setPrototypeOf(obj, constructor.prototype)`

#### 如果对象无法响应某个请求，它会把这个请求委托给它的构造器的原型
- 虽然 JavaScript 的对象最初都是从 `Object.prototype` 对象克隆而来的，但**对象构造器的原型并不仅限于 `Object.prototype`，而是可以动态指向其他对象**。这样一来，当对象a 需要借用对象b 的能力时，可以有选择性地把对象a 的构造器的原型指向对象b，从而达到继承的效果。

- 下面的代码是我们最常用的原型继承方式：
<CodeRun>
{
  `
  var obj = { name: 'sven' };
  var A = function(){};
  A.prototype = obj;
  var a = new A();
  console.log( a.name ); // sven
  /**
   * 首先，尝试遍历对象a 中的所有属性，但没有找到name 这个属性。 
   * 查找name 属性的这个请求被委托给对象a 的构造器的原型，它被a.__proto__ 记录着并且
     指向A.prototype，而A.prototype 被设置为对象obj。  
   * 在对象obj 中找到了name 属性，并返回它的值。
   */
  `
}
</CodeRun>

- 当我们期望得到一个“类”继承自另外一个“类”的效果时，往往会用下面的代码来模拟实现：
<CodeRun>
{
  `
  var A = function(){};
  A.prototype = { name: 'sven' };
  var B = function(){};
  B.prototype = new A();
  var b = new B();
  console.log( b.name );    // 输出：sven
  /**
   * 首先，尝试遍历对象b 中的所有属性，但没有找到name 这个属性。
   * 查找name 属性的请求被委托给对象b 的构造器的原型，它被b.__proto__ 记录着并且指向
     B.prototype，而B.prototype 被设置为一个通过new A()创建出来的对象。
   * 在该对象中依然没有找到 name 属性，于是请求被继续委托给这个对象构造器的原型 A.prototype。
   * 在A.prototype 中找到了name 属性，并返回它的值。
   */
  `
}
</CodeRun>

:::info
和把`B.prototype` 直接指向一个字面量对象相比，通过`B.prototype = new A()`形成的原型链比之前多了一层。但二者之间没有本质上的区别，都是将对象构造器的原型指向另外一个对象，**继承总是发生在对象和对象之间**。
:::

- 原型链并不是无限长的。

:::info
<CodeRun>
{
  `
  var obj = { name: 'sven' };
  var A = function(){};
  A.prototype = obj;
  var a = new A();
  console.log(a.address) // 输出：undefined
  `
}
</CodeRun>
如上，尝试访问对象a 的address 属性，当请求达到 A.prototype，并且在 A.prototype 中也没有找到 address 属性的时候，请求会被传递给 A.prototype 的构造器原型 `Object.prototype`，显然 `Object.prototype` 中也没有address 属性，但 `Object.prototype` 的原型是`null`，说明这时候原型链的后面已经没有别的节点了。所以该次请求就到此打住，a.address 返回`undefined`。
:::

:::info
ECMAScript 6 带来了新的`Class` 语法。这让JavaScript 看起来像是一门基于类的语言，但其背后仍是通过原型机制来创建对象。
<CodeRun>
{
  `
  class Animal {
    constructor(name) {
      this.name = name;
    }
    getName() {
      return this.name;
    }
  }
  class Dog extends Animal {
    constructor(name) {
      super(name);
    }
    speak() {
      return "woof";
    }
  }
  var dog = new Dog("Scamp");
  console.log(dog.getName() + ' says ' + dog.speak()); // Scamp says woof
  `
}
</CodeRun>
<CodeRun>
{
  `
  function Animal(name) {
    this.name = name;
  }
  Animal.prototype.getName = function() {
    return this.name;
  }
  var dog = {
    name: 'Scamp',
    speak: function() {
      return "woof";
    }
  };
  Object.setPrototypeOf(dog, Animal.prototype);
  console.log(dog.getName() + ' says ' + dog.speak()); // Scamp says woof
  `
}
</CodeRun>
:::

## `this`、`call`、`apply`
[js-core/this: call,apply,bind,new](https://fqishuai.onrender.com/docs/js/core/this)

## 闭包和高阶函数
- [js-core/闭包](https://fqishuai.onrender.com/docs/js/core/closure)

- [js-core/高阶函数](https://fqishuai.onrender.com/docs/js/core/callbacks&currying)
