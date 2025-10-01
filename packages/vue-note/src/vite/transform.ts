import type { Rollup, TransformResult } from 'vite'
import type { VueNoteQuery } from './query'
import { parse } from '../compilor/parse'

export function transform(src: string, filename: string, ctx: Rollup.TransformPluginContext, query: VueNoteQuery, _ssr: boolean): TransformResult | void {
  if (query.raw)
    return

  const _file = parse(src, filename, ctx)

  return {
    code: src,
    map: null,
  }
}
