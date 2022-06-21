import React from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

export default function HelloReact() {
  return (
    <Layout title="Hello2" description="Hello React Page">
      <div className='tailwind'>
        <div className='text-lg text-center py-5'>
          <p>修改 <code>pages/helloReact.tsx</code>，然后保存，页面会重载。</p>
          <p className="font-bold">TODO: 写个todolist页面</p>
          <p className="font-bold">把<code>StackBlitz</code>用起来</p>
          <p>下面是<code>CodeBlock</code>的使用demo</p>
          <CodeBlock
            language="jsx"
            title="/src/components/HelloCodeTitle.js"
            showLineNumbers
            className="w-1/3 mx-auto"
          >
            {
              `function HelloCodeTitle(props) {
                return <h1>你好，{props.name}</h1>;
              }`
            }
          </CodeBlock>
        </div>
      </div>
    </Layout>
  )
}