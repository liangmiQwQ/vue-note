import type { CallExpression, Comment, ExpressionStatement, ParseResult } from 'oxc-parser'
import type { Rollup } from 'vite'
import { parseSync } from 'oxc-parser'
import { ScopeTracker, walk } from 'oxc-walker'
import { print } from 'recast'
import { getID } from './utils/id'

export interface RawComponent {
  script: string
  template: string
  id: string
}

export interface FileParseResult {
  astRestult: ParseResult
  rawComponents: RawComponent[]
}

class VariablesScopeTracker extends ScopeTracker {
  getVariablesInScope(): string[] {
    if (!this.scopeIndexKey) {
      return [...(this.scopes.get('')?.keys() || [])]
    }
    const indices = this.scopeIndexKey.split('-').map(Number)

    const vars: string[] = []
    for (let i = indices.length; i >= 0; i--) {
      vars.push(...(this.scopes.get(indices.slice(0, i).join('-'))?.keys() || []))
    }

    return vars
  }
}

export function parse(src: string, filename: string, ctx: Rollup.TransformPluginContext): FileParseResult {
  const result = parseSync(filename, src)

  return {
    astRestult: result,
    rawComponents: getRawComponents(result, ctx),
  }
}

export function getRawComponents(astResult: ParseResult, ctx: Rollup.TransformPluginContext): RawComponent[] {
  // to parse ast, get component
  const rawComponents: RawComponent[] = []

  const variablesScopeTracker = new VariablesScopeTracker()
  walk(astResult.program, {
    scopeTracker: variablesScopeTracker,
    enter(node) {
      if (node.type === 'CallExpression') {
        if (node.callee.type === 'Identifier' && node.callee.name === 'defineCommentComponent') {
        // for each components
          const componentFunction = node.arguments[0]
          const isFunction = componentFunction.type === 'ArrowFunctionExpression' || componentFunction.type === 'FunctionExpression'

          if (isFunction && componentFunction.body?.type === 'BlockStatement') {
            const component = componentFunction.body // get function body as <script setup>
            const _templateIndex = component.body.findIndex(e => e.type === 'ExpressionStatement'
              && e.expression.type === 'CallExpression'
              && e.expression.callee.type === 'Identifier'
              && e.expression.callee.name === 'defineTemplate')

            let template: CallExpression | undefined
            if (_templateIndex !== -1) {
              const [_templateExpression] = component.body.splice(_templateIndex, 1) // remove defineTemplate macros from script
              template = (_templateExpression as ExpressionStatement).expression as CallExpression
            }

            rawComponents.push({
              script: `import {${variablesScopeTracker.getVariablesInScope().join(',')}} from 'vue-note';${print(component).code.slice(1, -1)}`,
              template: template ? getTemplate(template.callee.end, template.end, astResult.comments) : '',
              id: getID(node),
            })
          }
          else {
            ctx.error(`defineCommentComponent() expects a function literal for static analysis, but got a ${componentFunction.type}`)
          }
        }
      }
    },
  })

  return rawComponents
}

export function getTemplate(start: number, end: number, comments: Comment[]): string {
  const match = comments.find(comment =>
    comment.type === 'Block' && comment.start > start && comment.end < end,
  )?.value.trim().match(/^@template(.*)/s)

  return match ? match[1].trim() : ''
}
