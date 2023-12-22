import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "blog",
  outDir: './dist',
  assetsDir: '/',
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
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: '数组展开', link: '/array-flatten' },
          { text: 'promise', link: '/promise' },
          { text: 'vite', link: '/vite' },
          { text: 'webpack', link: '/webpack' },
          { text: 'html&css', link: '/html&css'},
          { text: 'javascript', link: '/javascript'},
          { text: 'typescript', link: '/typescript'},
          { text: 'vue', link: '/vue'},
          { text: 'browser', link: '/browser'},
          { text: 'other', link: '/other'},
          { text: 'handwriting', link: '/handwriting'},
          { text: 'vue2', link: '/vue2'},
          { text: 'vue-router', link: '/vue-router'}
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
