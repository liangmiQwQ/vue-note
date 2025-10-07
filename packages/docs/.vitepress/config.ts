import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'

const SidebarNav = [
  { text: 'Guide', items: [
    { text: 'Introduction', link: '/guide/introduction' },
    { text: 'Quick Start', link: '/guide/quick-start' },
    { text: 'Flexibility', link: '/guide/flexibility' },
  ] },
  { text: 'Advenced', items: [
    { text: 'Linter & Formatter', link: '/advenced/linter-formatter' },
    { text: 'TypeScript', link: '/advenced/typescript' },
    { text: 'API Reference', link: '/advenced/api-reference' },

  ] },
  { text: 'Extra Topic', items: [
    { text: 'Design Philosophy', link: '/extra/design-philosophy' },
    { text: 'Contribute Guide', link: '/extra/contribute' },
    { text: 'Credits', link: '/extra/credits' },
  ] },
]

export default defineConfig({
  title: 'Vue Note',
  description: 'Write Vue template in code comment?',
  srcDir: './src',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  ],
  themeConfig: {
    logo: '/favicon.svg',
    nav: SidebarNav,
    search: {
      provider: 'local',
    },
    sidebar: {
      '/': SidebarNav,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/liangmiQwQ/vue-note' },
    ],
    editLink: {
      pattern: 'https://github.com/liangmiQwQ/vue-note/edit/main/packages/docs/src/:path',
      text: 'Suggest changes to this page',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2025 - Present Liang Mi',
    },
  },
  vite: {
    plugins: [
      UnoCSS(),
    ],
  },
})
