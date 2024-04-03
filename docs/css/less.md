---
tags: [css extension]
---

[less](https://lesscss.org/)；[中文文档](https://lesscss.cn/)

## 变量
### 变量用于控制CSS规则中的值
使用变量前：
```css
a,
.link {
  color: #428bca;
}
.widget {
  color: #fff;
  background: #428bca;
}
```
使用变量后：
```less
// Variables
@link-color:        #428bca; // sea blue
@link-color-hover:  darken(@link-color, 10%);

// Usage
a,
.link {
  color: @link-color;
}
a:hover {
  color: @link-color-hover;
}
.widget {
  color: #fff;
  background: @link-color;
}
```

### 变量用于选择器名称
```less
// Variables
@my-selector: banner;

// Usage
.@{my-selector} {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}
```
编译为：
```css
.banner {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}
```

### 变量用于导入语法
```less
// Variables
@themes: "../../src/themes";

// Usage
@import "@{themes}/tidal-wave.less";
```

## 转义
转义符为`~`，`~"some_text"`中的任何内容将显示为 `some_text` 。
```less
p {
  color: ~"green";
}
```
编译后：
```css
p {
  color: green;
}
```

## [父级选择器](https://lesscss.cn/features/#parent-selectors-feature)
`&` 运算符表示 嵌套规则 的父选择器
```less
a {
  color: blue;
  &:hover {
    color: green;
  }
}
```
编译后：
```css
a {
  color: blue;
}

a:hover {
  color: green;
}
```

`&` 的另一个典型用途是生成重复的类名：
```less
.button {
  &-ok {
    background-image: url("ok.png");
  }
  &-cancel {
    background-image: url("cancel.png");
  }

  &-custom {
    background-image: url("custom.png");
  }
}
```
编译后：
```css
.button-ok {
  background-image: url("ok.png");
}
.button-cancel {
  background-image: url("cancel.png");
}
.button-custom {
  background-image: url("custom.png");
}
```

`&` 可能会在一个选择器中出现多次。这使得重复引用父选择器而不重复其名称成为可能。
```less
.link {
  & + & {
    color: red;
  }

  & & {
    color: green;
  }

  && {
    color: blue;
  }

  &, &ish {
    color: cyan;
  }
}
```
编译后：
```css
.link + .link {
  color: red;
}
.link .link {
  color: green;
}
.link.link {
  color: blue;
}
.link, .linkish {
  color: cyan;
}
```

请注意，`&` 代表所有父选择器（不仅仅是最近的祖级）
```less
.grand {
  .parent {
    & > & {
      color: red;
    }

    & & {
      color: green;
    }

    && {
      color: blue;
    }

    &, &ish {
      color: cyan;
    }
  }
}
```
编译后：
```css
.grand .parent > .grand .parent {
  color: red;
}
.grand .parent .grand .parent {
  color: green;
}
.grand .parent.grand .parent {
  color: blue;
}
.grand .parent,
.grand .parentish {
  color: cyan;
}
```