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
:::info
在`命令模式`中，请求被封装在一些命令对象中，这使得命令的调用者和命令的接收者可以完全解耦开来，当调用命令的execute 方法时，不同的命令会做不同的事情，从而会产生不同的执行结果。而做这些事情的过程是早已被封装在命令对象内部的，作为调用命令的客户，根本不必去关心命令执行的具体过程。

在`组合模式`中，多态性使得客户可以完全忽略组合对象和叶节点对象之前的区别，这正是组合模式最大的作用所在。对组合对象和叶节点对象发出同一个消息的时候，它们会各自做自己应该做的事情，组合对象把消息继续转发给下面的叶节点对象，叶节点对象则会对这些消息作出真实的反馈。

在`策略模式`中，Context 并没有执行算法的能力，而是把这个职责委托给了某个策略对象。每个策略对象负责的算法已被各自封装在对象内部。当我们对这些策略对象发出“计算”的消息时，它们会返回各自不同的计算结果。
:::

- 在JavaScript 这种将函数作为一等对象的语言中，函数本身也是对象，函数用来封装行为并且能够被四处传递。**当我们对一些函数发出“调用”的消息时，这些函数会返回不同的执行结果，这是“多态性”的一种体现，也是很多设计模式在JavaScript中可以用高阶函数来代替实现的原因**。

### 封装
