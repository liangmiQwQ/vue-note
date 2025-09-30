import type { PluginOption } from 'vite'

export function VueNote(): PluginOption {
  return {
    name: 'vue-note',
    transform(src, id) {
      if (id.endsWith('.ts') && src.includes('defineCommentComponents')) {
        return src.replace('defineCommentComponents', 'defineSomething')
      }
    },
  }
}
