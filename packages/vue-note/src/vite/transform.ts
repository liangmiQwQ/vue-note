import type { Rollup, TransformResult, ViteDevServer } from 'vite'
import type { CompiledComponent } from '../compilor/component'
import type { VueNoteQuery } from './query'
import { parseComponents } from '../compilor/component'
import { parse } from '../compilor/parse'
import { resolve } from '../compilor/resolve'

export interface TransformOption {
  server: ViteDevServer
  isProduction: boolean
}

export async function transform(src: string, filename: string, ctx: Rollup.TransformPluginContext, query: VueNoteQuery, ssr: boolean, opt: TransformOption): Promise<TransformResult | void> {
  if (query.raw)
    return

  const fileParseResult = parse(src, filename, ctx) // get AST & raw components (scripts and templates)
  const compiledComponents = parseComponents(filename, fileParseResult.rawComponents)

  let resolvedComponents: CompiledComponent[]
  // processing hmr
  if (!ssr && opt.server && opt.server.config.server.hmr !== false && !opt.isProduction) {
    resolvedComponents = compiledComponents.map(e => e)
  }
  else {
    resolvedComponents = compiledComponents
  }

  const resolvedCode = resolve(fileParseResult.astRestult.program, resolvedComponents, ctx)

  const { rolldownVersion, transformWithOxc } = await import('vite')
  if (rolldownVersion) {
    const { code } = await transformWithOxc(
      resolvedCode,
      filename,
      {
        lang: 'ts',
      },
    )
    return {
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
    return {
      code,
      map: null,
    }
  }
}
