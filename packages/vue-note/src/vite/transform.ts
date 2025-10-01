import type { Expression, ExpressionStatement, FunctionBody } from 'oxc-parser'
import type { Rollup, TransformResult } from 'vite'
import type { VueNoteQuery } from './query'
import { parseSync, Visitor } from 'oxc-parser'

export function transform(src: string, filename: string, ctx: Rollup.TransformPluginContext, query: VueNoteQuery, _ssr: boolean): TransformResult | void {
  if (query.raw)
    return

  const result = parseSync(filename, src)
  const components: FunctionBody[] = []
  const visitor = new Visitor({
    CallExpression(decl) {
      if (decl.callee.type === 'Identifier' && decl.callee.name === 'defineCommentComponent') {
        const componentFunction = decl.arguments[0]
        const isFunction = componentFunction.type === 'ArrowFunctionExpression' || componentFunction.type === 'FunctionExpression'

        if (isFunction && componentFunction.body?.type === 'BlockStatement') {
          const component = componentFunction.body
          const _templateIndex = component.body.findIndex(e => e.type === 'ExpressionStatement'
            && e.expression.type === 'CallExpression'
            && e.expression.callee.type === 'Identifier'
            && e.expression.callee.name === 'defineTemplate')

          let template: Expression | undefined
          if (_templateIndex !== -1) {
            const [_templateExpression] = component.body.splice(_templateIndex, 1)
            template = (_templateExpression as ExpressionStatement).expression
          }

          const _a = template?.end
        }
        else {
          ctx.error(`defineCommentComponent() expects a function literal for static analysis, but got a ${componentFunction.type}`)
        }
      }
    },
  })
  visitor.visit(result.program)

  const _scripts = components.map((e) => {
    return src.slice(e.start + 1, e.end - 1)
  })

  return {
    code: src,
    map: null,
  }
}
