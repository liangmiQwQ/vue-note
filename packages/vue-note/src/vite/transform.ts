import type { Rollup, TransformResult, ViteDevServer } from 'vite'
import type { FileParseResult } from '../compilor/parse'
import type { VueNoteQuery } from './query'
import { createHash } from 'node:crypto'
import { walk } from 'oxc-walker'
import { parseComponents } from '../compilor/component'
import { parse } from '../compilor/parse'
import { resolve } from '../compilor/resolve'
import { getUniqueID } from '../compilor/utils/id'

export interface TransformOption {
  server: ViteDevServer
  isProduction: boolean
}

export interface TransformHashCache {
  ast: string
  template: Map<string, string>
}

export async function transform(
  src: string,
  filename: string,
  ctx: Rollup.TransformPluginContext,
  query: VueNoteQuery,
  ssr: boolean,
  opt: TransformOption,
  cache?: TransformHashCache,
): Promise<{ result?: TransformResult, cache?: TransformHashCache }> {
  if (query.raw)
    return {}

  const hmr = !ssr && opt.server && opt.server.config.server.hmr !== false && !opt.isProduction

  const fileParseResult = parse(src, filename, ctx) // get AST & raw components (scripts and templates)
  const _cache = getCache(filename, fileParseResult)
  const compiledComponents = parseComponents(filename, fileParseResult.rawComponents)
  const resolvedCode = resolve(fileParseResult.astRestult.program, compiledComponents, ctx, hmr && [cache, _cache])

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
    cache: _cache,
  }
}

function getCache(filename: string, result: FileParseResult): TransformHashCache {
  const template = new Map<string, string>()

  result.rawComponents.forEach((e) => {
    template.set(getUniqueID(filename, e.id), createHash('md5').update(e.template).digest('hex'))
  })

  const programIgnoredLocation = JSON.parse(JSON.stringify(result.astRestult.program))

  walk(programIgnoredLocation, {
    enter(node) {
      node.range = [0, 0]
      node.start = 0
      node.end = 0

      this.replace(node)
    },
  })

  return {
    ast: createHash('md5').update(JSON.stringify(programIgnoredLocation)).digest('hex'),
    template,
  }
}
