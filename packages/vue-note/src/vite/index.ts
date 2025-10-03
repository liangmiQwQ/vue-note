import type { PluginOption } from 'vite'
import type { TransformOption } from './transform'
import { parseQuery } from './query'
import { transform } from './transform'

export function VueNote(): PluginOption {
  const transformOption: Partial<TransformOption> = {}

  return {
    name: 'vue-note',
    async transform(src, id, opt) {
      const ssr = opt?.ssr === true
      const { filename, query } = parseQuery(id)

      if (!filename.endsWith('.ts'))
        return

      const { result } = await transform(src, filename, this, query, ssr, transformOption as TransformOption)
      return result
    },
    configureServer(server) {
      transformOption.server = server
    },
    configResolved(config) {
      transformOption.isProduction = config.isProduction
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
