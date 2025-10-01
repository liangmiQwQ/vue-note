import type { Argument } from 'oxc-parser'
import type { TransformResult } from 'vite'
import type { VueNoteQuery } from './query'
import { parseSync, Visitor } from 'oxc-parser'

export function transform(src: string, filename: string, query: VueNoteQuery, _ssr: boolean): TransformResult | void {
  if (query.raw)
    return

  const result = parseSync(filename, src)

  const components: Argument[] = []
  const visitor = new Visitor({
    CallExpression(decl) {
      if (decl.callee.type === 'Identifier') {
        if (decl.callee.name === 'defineCommentComponent') {
          components.push(decl.arguments[0])
        }
      }
    },
  })
  visitor.visit(result.program)

  // console.dir(components, { depth: null, colors: true })

  return {
    code: src,
    map: null,
  }
}
