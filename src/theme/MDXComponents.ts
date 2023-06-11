import React from 'react';
// 导入原映射
import MDXComponents from '@theme-original/MDXComponents';
import Underline from '@site/src/components/Underline';
import RunKit from 'react-runkit-embed/RunKit';

export default {
  // 复用默认的映射
  ...MDXComponents,
  // 把 "underline" 标签映射到我们的 <Underline /> 组件！
  // `Underline` 会收到在 MDX 中被传递给 `underline` 的所有 props
  underline: Underline,
  RunKit,
};