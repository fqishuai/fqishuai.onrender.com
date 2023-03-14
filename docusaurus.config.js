// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'fqishuai',
  tagline: '记录不仅仅是沉淀，也是个理解的过程，杜绝复制粘贴，更禁止只记录别人文章的跳转链接！',
  url: 'https://blog-fqishuai.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'https://s0.lgstatic.com/i/image/M00/41/92/CgpEMllU3hWAFygCAAZ9z9H7nhk224.jpg',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'fqishuai', // Usually your GitHub org/user name.
  projectName: 'blog', // Usually your repo name.

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
          editUrl: 'https://github.com/fqishuai/blog/tree/main/',
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
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
        title: 'fqishuai',
        logo: {
          alt: 'My Site Logo',
          src: 'https://s0.lgstatic.com/i/image/M00/41/92/CgpEMllU3hWAFygCAAZ9z9H7nhk224.jpg',
        },
        items: [
          {
            type: 'doc',
            docId: 'index/docsIndex',
            position: 'right',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'right'},
          {to: '/todo-list', label: 'Pages', position: 'right'},
          {
            label: '技术报刊',
            position : 'right',
            items: [
              {
                label: 'Frontend Weekly Digest',
                href: 'https://frontender-ua.medium.com/',
              },
              {
                label: '前沿技术解析',
                href: 'https://www.thoughtworks.com/zh-cn/radar',
              },
              {
                label: '字节前端技术周报',
                href: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzg2ODQ1OTExOA==&action=getalbum&album_id=1706105889872527361&scene=173&from_msgid=2247500975&from_itemidx=1&count=3&nolastread=1#wechat_redirect',
              },
              {
                label: '转转前端周刊',
                href: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzU0OTExNzYwNg==&action=getalbum&album_id=2368788922895220737&scene=173&from_msgid=2247495372&from_itemidx=1&count=3&nolastread=1#wechat_redirect',
              },
              {
                label: '奇舞周刊',
                href: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzg4MTYwMzY1Mw==&action=getalbum&album_id=1899297601078771727&scene=173&from_msgid=2247504287&from_itemidx=1&count=3&nolastread=1#wechat_redirect',
              },
              {
                label: 'MDH前端周刊',
                href: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MjM5NDgyODI4MQ==&action=getalbum&album_id=1862545371797749761&scene=173&from_msgid=2247485744&from_itemidx=1&count=3&nolastread=1#wechat_redirect',
              },
              {
                label: '技术雷达',
                href: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MjM5MjY3OTgwMA==&action=getalbum&album_id=1564396246507847682&scene=173&from_msgid=2652483783&from_itemidx=1&count=3&nolastread=1#wechat_redirect',
              },
            ]
          },
          {label: 'course', position: 'right', items: [
            {
              label: '极客课程',
              href: 'https://time.geekbang.org/dashboard/course'
            },
            {
              label: '拉勾课程',
              href: 'https://kaiwu.lagou.com/learn'
            },
          ]},
          {label: '图谱', position: 'right', href: 'https://f2e.tech/'},
          {label: 'coding', position: 'right', items: [
            {
              label: 'replit',
              href: 'https://replit.com/'
            },
            {
              label: 'code.juejin',
              href: 'https://code.juejin.cn/'
            },
            {
              label: 'codesandbox.io',
              href: 'https://codesandbox.io/'
            },
            {
              label: 'glitch',
              href: 'https://glitch.com/'
            },
            {
              label: 'plnkr.co',
              href: 'https://plnkr.co/'
            },
          ]},
          {label: 'flash-note', position: 'right', href: 'https://juejin.cn/flash-note/list'},
          {label: '脑图', position: 'right', href: 'https://naotu.baidu.com/home'},
          {label: 'GitHub', position: 'right', href: 'https://github.com/fqishuai/blog'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Trending',
            items: [
              {
                label: 'JS Risings Stars',
                href: 'https://risingstars.js.org/',
              },
              {
                label: 'daily.dev',
                href: 'https://app.daily.dev/',
              },
            ],
          },
          {
            title: 'Blog Site',
            items: [
              {
                label: 'builder.io blog',
                href: 'https://www.builder.io/blog',
              },
              {
                label: 'daily.dev blog',
                href: 'https://daily.dev/blog',
              },
              {
                label: 'JamesSinclair blog',
                href: 'https://jrsinclair.com/',
              },
              {
                label: 'bobbyhadz blog',
                href: 'https://bobbyhadz.com/',
              },
              {
                label: 'maximeheckel blog',
                href: 'https://blog.maximeheckel.com/',
              },
              {
                label: 'robinwieruch blog',
                href: 'https://www.robinwieruch.de/blog/',
              },
              {
                label: 'Joshua Comeau',
                href: 'https://www.joshwcomeau.com',
              },
            ],
          },
          {
            title: 'Tools',
            items: [
              {
                label: '码力全开',
                href: 'https://maliquankai.com/',
              },
              {
                label: 'transform.tools',
                href: 'https://transform.tools/html-to-jsx',
              },
            ],
          },
          {
            title: 'Pages',
            items: [
              {
                label: 'TodoList',
                to: '/todo-list',
              },
              {
                label: 'markdown',
                to: '/markdown',
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
                label: 'CCF数字图书馆',
                href: 'https://dl.ccf.org.cn/index.html?_ack=1',
              },
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
                label: '网易云音乐',
                to: 'https://juejin.cn/user/4265760847567016',
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
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
      docs: {
        sidebar: {
          hideable: true,
        },
      },
    }),
};

module.exports = config;
