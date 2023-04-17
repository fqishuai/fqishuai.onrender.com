import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures/custom';

import styles from './index.module.css';
import Card from '../components/Card';
import titleImg from './imgs/title.jpg';
import title1Img from './imgs/title1.jpg';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="hero__subtitle">
        大多数人穷尽一生去弥补劣势，却不知从无能提升到平庸所要付出的精力，远远超过从一流提升到卓越所要付出的努力。唯有依靠优势，才能实现卓越。 --- 彼得·德鲁克
        </div>
        {/* <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/todo-list">
            Todo List
          </Link>
        </div> */}
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="fqishuai's site"
    >
      <div className='tailwind'>
        <div className='flex justify-center my-5'>
          {/* <img src={titleImg} /> */}
          <img src={title1Img} />
        </div>
        <div className='mx-10 my-5 flex justify-around flex-wrap'>
          <Card
            linkValue='https://javascript.info/'
            title='javascript.info'
            bgColor='bg-[#FBE7C6]'
            titleColor='text-[#15B5B0]'
            contntColor='text-[#FA26A0]'
          >
            The Modern JavaScript Tutorial: 涵盖JavaScript和浏览器的讲解
          </Card>
          <Card
            linkValue='https://github.com/getify/Functional-Light-JS'
            title='Functional-Light-JS'
            bgColor='bg-[#B4F8C8]'
            titleColor='text-[#FA26A0]'
            contntColor='text-[#FFA384]'
          >
            "Functional-Light JavaScript" explores the core principles of functional programming (FP) as they are applied to JavaScript.
          </Card>
          <Card
            linkValue='https://ideazhao.com/2021/09/05/wechat_function/'
            title='JavaScript世界的一等公民—函数'
            bgColor='bg-[#A0E7E5]'
            titleColor='text-[#FA26A0]'
            contntColor='text-[#FFA384]'
          >
            现今各种框架、工具‘横行’，到处在讲原理和源码，更有跨端技术需要我们去探索，但如果基本功不好，学什么都是事倍功半，效果很不好。
          </Card>
          <Card
            linkValue='https://js.okten.cn'
            title='JavaScript: The Definitive Guide'
            bgColor='bg-[#FFAEBC]'
            titleColor='text-[#EFE7BC]'
            contntColor='text-[#15B5B0]'
          >
            犀牛书---《JavaScript 权威指南第七版》中英对照
          </Card>
          <Card
            linkValue='https://eloquentjavascript.net/'
            title='Eloquent JavaScript'
            bgColor='bg-[#FFAEBC]'
            titleColor='text-[#EFE7BC]'
            contntColor='text-[#15B5B0]'
          >
            Eloquent JavaScript 3rd edition (2018)
          </Card>
          <Card
            linkValue='https://www.patterns.dev/'
            title='Patterns.dev'
            bgColor='bg-[#FBE7C6]'
            titleColor='text-[#15B5B0]'
            contntColor='text-[#FA26A0]'
          >
            Patterns.dev is a free book on design patterns and component patterns for building powerful web apps with vanilla JavaScript and React.
          </Card>
          <Card
            linkValue='https://www.javascripttutorial.net/'
            title='JavaScript Tutorial'
            bgColor='bg-[#B4F8C8]'
            titleColor='text-[#FA26A0]'
            contntColor='text-[#FFA384]'
          >
            This JavaScript Tutorial helps you learn the JavaScript programming language from scratch quickly and effectively.
          </Card>
          <Card
            linkValue='https://www.typescripttutorial.net/'
            title='TypeScript Tutorial'
            bgColor='bg-[#A0E7E5]'
            titleColor='text-[#FA26A0]'
            contntColor='text-[#FFA384]'
          >
            TypeScript adds types to JavaScript to help you speed up the development by catching errors before you even run the JavaScript code.
          </Card>
        </div>
      </div>
      {/* <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main> */}
    </Layout>
  );
}
