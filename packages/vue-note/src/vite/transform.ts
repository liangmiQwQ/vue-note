import type { Rollup, TransformResult, ViteDevServer } from 'vite'
import type { VueNoteQuery } from './query'
import { parseComponents } from '../compilor/component'
import { parse } from '../compilor/parse'
import { resolve } from '../compilor/resolve'

export interface TransformOption {
  server: ViteDevServer
  isProduction: boolean
}

export async function transform(src: string, filename: string, ctx: Rollup.TransformPluginContext, query: VueNoteQuery, ssr: boolean, opt: TransformOption): Promise<{ result?: TransformResult }> {
  if (query.raw)
    return {}

  const hmr = !ssr && opt.server && opt.server.config.server.hmr !== false && !opt.isProduction

  const fileParseResult = parse(src, filename, ctx) // get AST & raw components (scripts and templates)
  const compiledComponents = parseComponents(filename, fileParseResult.rawComponents)
  const resolvedCode = resolve(fileParseResult.astRestult.program, compiledComponents, ctx, hmr)

  let result: TransformResult
  const { rolldownVersion, transformWithOxc } = await import('vite')
  if (rolldownVersion) {
    const { code } = await transformWithOxc(
      resolvedCode,
      filename,
      {
        lang: 'ts',
      },
    )
    result = {
      code,
      map: null,
    }
  }
  else {
    const { transformWithEsbuild } = await import('vite')
    const { code } = await transformWithEsbuild(
      resolvedCode,
      filename,
      {
        target: 'esnext',
        charset: 'utf8',
        loader: 'ts',
      },
    )
    result = {
      code,
      map: null,
    }
  }

  return {
    result,
  }
}
