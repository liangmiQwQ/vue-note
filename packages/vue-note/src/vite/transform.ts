import type { Rollup, TransformResult } from 'vite'
import type { VueNoteQuery } from './query'
import { parseComponents } from '../compilor/component'
import { parse } from '../compilor/parse'
import { resolve } from '../compilor/resolve'

export function transform(src: string, filename: string, ctx: Rollup.TransformPluginContext, query: VueNoteQuery, _ssr: boolean): TransformResult | void {
  if (query.raw)
    return

  const fileParseResult = parse(src, filename, ctx) // get AST & raw components (scripts and templates)
  const compiledComponents = parseComponents(filename, fileParseResult.rawComponents)
  const resolvedCode = resolve(fileParseResult.astRestult.program, compiledComponents)

  return {
    code: resolvedCode,
    map: null,
  }
}
