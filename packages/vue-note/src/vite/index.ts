import type { PluginOption } from 'vite'
import { parseQuery } from './query'
import { transform } from './transform'

export function VueNote(): PluginOption {
  return {
    name: 'vue-note',
    async transform(src, id, opt) {
      const ssr = opt?.ssr === true
      const { filename, query } = parseQuery(id)

      return transform(src, filename, this, query, ssr)
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
