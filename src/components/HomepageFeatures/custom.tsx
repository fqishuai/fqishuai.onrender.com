import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
  linkUrl?: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Docs MD(X)',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        If you added <code>slug: /</code> to a doc to make it the homepage, 
        you should delete the existing homepage at <code>./src/pages/index.js</code>.
      </>
    ),
    linkUrl: '/docs/react/usage',
  },
  {
    title: 'Blog list',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Docusaurus will extract a <code>YYYY-MM-DD</code> date from a file/folder name such as <code>YYYY-MM-DD-my-blog-post-title.md</code>.
      </>
    ),
    linkUrl: '/blog/hello-blog',
  },
  {
    title: 'React Pages',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        You will need to import the Layout component from @theme/Layout if you want the navbar and/or footer to appear.
      </>
    ),
    linkUrl: '/todo-list',
  },
];

function Feature({title, Svg, description, linkUrl}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3><Link to={linkUrl}>{title}</Link></h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
