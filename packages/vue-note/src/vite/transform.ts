import type { Rollup, TransformResult } from 'vite'
import type { VueNoteQuery } from './query'
import { rolldownVersion, transformWithEsbuild, transformWithOxc } from 'vite'
import { parseComponents } from '../compilor/component'
import { parse } from '../compilor/parse'
import { resolve } from '../compilor/resolve'

export async function transform(src: string, filename: string, ctx: Rollup.TransformPluginContext, query: VueNoteQuery, _ssr: boolean): Promise<TransformResult | void> {
  if (query.raw)
    return

  const fileParseResult = parse(src, filename, ctx) // get AST & raw components (scripts and templates)
  const compiledComponents = parseComponents(filename, fileParseResult.rawComponents)
  const resolvedCode = resolve(fileParseResult.astRestult.program, compiledComponents, ctx)

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
