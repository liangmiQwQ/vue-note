import type { PluginOption } from 'vite'

export function VueNote(): PluginOption {
  return {
    name: 'vue-note',
    transform(src, id) {
      if (id.endsWith('.ts') && src.includes('defineCommentComponents')) {
        return src.replace('defineCommentComponents', 'defineSomething')
      }
    },
    config(config) { // disable esbuild (oxc) to process typescript
      if (!config.esbuild) {
        config.esbuild = {}
      }
      config.esbuild.exclude = [
        ...(
          config.esbuild.exclude
            ? (
                Array.isArray(config.esbuild.exclude)
                  ? config.esbuild.exclude
                  : [config.esbuild.exclude]
              )
            : []
        ),
        /\.ts$/,
      ]

      return config
    },
  }
}
