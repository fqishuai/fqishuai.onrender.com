import React from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

export default function HelloReact() {
  return (
    <Layout title="Hello2" description="Hello React Page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
        }}>
        <p>
          修改 <code>pages/helloReact.js</code>，然后保存，页面会重载。
        </p>
      </div>
      <CodeBlock
        language="jsx"
        title="/src/components/HelloCodeTitle.js"
        showLineNumbers
      >
        {
          `function HelloCodeTitle(props) {
            return <h1>你好，{props.name}</h1>;
          }`
        }
      </CodeBlock>
    </Layout>
  )
}