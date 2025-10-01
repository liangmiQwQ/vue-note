import type { CallExpression, Comment, ExpressionStatement, ParseResult } from 'oxc-parser'
import type { Rollup } from 'vite'
import { parseSync, Visitor } from 'oxc-parser'
import { print } from 'recast'

export interface RawComponent {
  script: string
  template: string
}

export interface FileParseResult {
  astRestult: ParseResult
  rawComponents: RawComponent[]
}

export function parse(src: string, filename: string, ctx: Rollup.TransformPluginContext): FileParseResult {
  const result = parseSync(filename, src)

  return {
    astRestult: result,
    rawComponents: getRawComponents(result, ctx),
  }
}

export function getRawComponents(astResult: ParseResult, ctx: Rollup.TransformPluginContext): RawComponent[] {
  const rawComponents: RawComponent[] = []

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

          let template: CallExpression | undefined
          if (_templateIndex !== -1) {
            const [_templateExpression] = component.body.splice(_templateIndex, 1)
            template = (_templateExpression as ExpressionStatement).expression as CallExpression
          }

          rawComponents.push({
            script: print(component).code.slice(1, -1),
            template: template ? getTemplate(template.callee.end, template.end, astResult.comments) : '',
          })
        }
        else {
          ctx.error(`defineCommentComponent() expects a function literal for static analysis, but got a ${componentFunction.type}`)
        }
      }
    },
  })

  visitor.visit(astResult.program)

  return rawComponents
}

export function getTemplate(start: number, end: number, comments: Comment[]): string {
  const match = comments.find((comment) => {
    return comment.type === 'Block' && comment.start > start && comment.end < end
  })?.value.trim().match(/^@template(.*)/s)

  return match ? match[1].trim() : ''
}
