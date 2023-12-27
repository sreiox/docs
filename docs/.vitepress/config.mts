import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "blog",
  base: "/docs/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'html&css', link: '/html&css'},
          { text: 'javascript', link: '/javascript'},
          { text: 'promise', link: '/promise' },
          { text: 'vue', link: '/vue'},
          { text: 'vite', link: '/vite' },
          { text: 'vue2', link: '/vue2'},
          { text: 'vue-router', link: '/vue-router'},
          { text: 'webpack', link: '/webpack' },
          { text: 'typescript', link: '/typescript'},
          { text: 'browser', link: '/browser'},
          { text: 'other', link: '/other'},
          { text: 'handwriting', link: '/handwriting'},
          { text: 'wechat', link: '/wechat' },
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
