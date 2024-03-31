import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "blog",
  base: "/docs/",
  themeConfig: {
    logo: '',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'menu',
        items: [
          { text: 'Examples', link: '/markdown-examples' },
          { text: 'Nodejs', link: '/node/', activeMatch: '^/node/', target: '_self' }
        ]
      }
    ],

    sidebar: [
      {
        text: 'Examples',
        collapsed: false,
        items: [
          { text: 'html&css', link: '/html&css'},
          { text: 'flex', link: '/flex'},
          { text: 'javascript', link: '/javascript'},
          { text: 'promise', link: '/promise' },
          { text: 'vue', link: '/vue'},
          { text: 'vite', link: '/vite' },
          { text: 'vue2', link: '/vue2'},
          { text: 'vue-router', link: '/vue-router'},
          { text: 'webpack', link: '/webpack' },
          { text: 'typescript', link: '/typescript'},
          { text: 'browser', link: '/browser'},
          { text: 'cache-example', link: '/cache-example' },
          { text: 'other', link: '/other'},
          { text: 'handwriting', link: '/handwriting'},
          { text: 'wechat', link: '/wechat' },
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          {text: 'optimization', link: '/optimization'},
          {text: 'http', link: '/http'}
        ]
      },
      {
        text: 'Nodejs',
        items: [
          { text: '用法和示例', link: '/node/'},
          { 
            text: 'http', 
            items: [
              {text: 'agent', link: '/node/http/agent'},
              {text: 'clientRequest', link: '/node/http/clientRequest'},
              {text: 'event', link: '/node/http/event'},
              {text: 'request', link: '/node/http/request'},
              {text: 'response', link: '/node/http/response'},
              {text: 'incoming-message', link: '/node/http/incoming-message'},
              {text: 'outgoing-message', link: '/node/http/outgoing-message'},
              {text: 'other-class', link: '/node/http/other-class'}
            ],
            collapsed: true
          },
          { 
            text: 'fs', 
            items: [
              {text: '用法和示例', link: '/node/fs/'},
              {text: 'promise-api', link: '/node/fs/promise-api'},
              {text: 'dir', link: '/node/fs/dir'}
            ],
            collapsed: true
          },
          { 
            text: 'assert', 
            link: '/node/assert'
          },
          { 
            text: 'async-hooks', 
            link: '/node/async-hooks'
          },
          { 
            text: 'buffer', 
            link: '/node/buffer'
          },
          { 
            text: 'socket', 
            link: '/node/socket'
          }
        ]
      },
      {
        text: 'github',
        link: '/github'
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present mima'
    },

    editLink: {
      pattern: ({ filePath }) => {
        return `https://github.com/sreio/vitepress/edit/main/docs/${filePath}`
      }
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    }
  }
})
