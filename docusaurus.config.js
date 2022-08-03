// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Blog - fqishuai',
  tagline: '记录不仅仅是沉淀，也是个理解的过程，杜绝复制粘贴，更禁止只记录别人文章的跳转链接！',
  url: 'https://blog-fqishuai.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en','zh-Hans'],
  },

  plugins: [
    "./src/plugins/postcss-tailwind",
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/fqishuai/blog/tree/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/fqishuai/blog/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        language: ["en", "zh"],
      },
    ],
    '@docusaurus/theme-live-codeblock',
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Blog - fqishuai',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {label: 'there is no royal road to learning', position: 'left', href: '/'},
          {
            type: 'doc',
            docId: 'js/learnJS',
            position: 'right',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'right'},
          {to: '/todo-list', label: 'Pages', position: 'right'},
          {label: '图谱', position: 'right', href: 'https://f2e.tech/'},
          {
            href: 'https://github.com/fqishuai/blog',
            label: 'GitHub',
            position: 'right',
          },
          {label: '脑图', position: 'right', href: 'https://naotu.baidu.com/home'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Pages',
            items: [
              {
                label: 'TodoList',
                to: '/todo-list',
              },
              {
                label: 'Hello',
                to: '/helloReact',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Segmentfault',
                href: 'https://segmentfault.com/',
              },
              {
                label: '掘金',
                href: 'https://juejin.cn',
              },
              {
                label: '腾讯云社区',
                href: 'https://cloud.tencent.com/developer/devdocs',
              },
              {
                label: 'Google Developers',
                href: 'https://developers.googleblog.com/',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Dev.to',
                href: 'https://dev.to/',
              },
              {
                label: 'Web.dev',
                href: 'https://web.dev/',
              },
              {
                label: 'Dot',
                href: 'https://www.thisdot.co/blog',
              },
              {
                label: '政采云前端',
                to: 'https://zoo.team/',
              },
              {
                label: '美团前端',
                to: 'https://tech.meituan.com/tags/%E5%89%8D%E7%AB%AF.html',
              },
              {
                label: '转转前端',
                href: 'https://www.zhihu.com/people/da-zhuan-zhuan-fe',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Blog - fqishuai, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
