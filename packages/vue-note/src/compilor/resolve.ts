import type { Expression, Function, ImportDeclaration, Program } from 'oxc-parser'
import type { Rollup } from 'vite'
import type { CompiledComponent } from './component'
import type { CacheHash } from './utils/hmr'
import { parseSync, Visitor } from 'oxc-parser'
import { walk } from 'oxc-walker'
import { print } from 'recast'
import { getComponentHmrCode, getRenderFunctionsObject, wrapperWithHmr } from './utils/hmr'
import { getID } from './utils/id'
import { dedupeImports } from './utils/imports'
import { wrapperComponent as parseComponent } from './utils/wrapper'

export function resolve(program: Program, compiledComponents: CompiledComponent[], ctx: Rollup.TransformPluginContext, hmrCache: [CacheHash | undefined, CacheHash] | false): string {
  const imports: ImportDeclaration[] = []
  const renderFunctionsMap = new Map<string, Function>()

  let index = 0
  walk(program, {
    enter(node) {
      // replace defineCommentComponent to compiled component
      if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'defineCommentComponent') {
        const component = compiledComponents.find(e => e.id === getID(index))!

        let script: Expression | undefined

        new Visitor({
          ExportDefaultDeclaration(decl) {
            script = decl.declaration as Expression
          },
          ImportDeclaration(decl) {
            // collect imports
            imports.push(decl)
          },
        }).visit(parseSync('foo.ts', component.code.main).program)

        if (component.code.template) {
          new Visitor({
            FunctionDeclaration(decl) {
              renderFunctionsMap.set(component.uniqueId, decl)
            },
            ImportDeclaration(decl) {
              // collect imports
              imports.push(decl)
            },
          }).visit(parseSync('foo.ts', component.code.template).program)
        }

        const result = parseComponent(script!, hmrCache ? getComponentHmrCode(component.uniqueId) : [], hmrCache && component.uniqueId)
        this.replace(result)

        index++
      }

      // remove macro imports
      if (node.type === 'ImportDeclaration') {
        imports.push(node)
        this.remove()
      }
    },
  })

  program.body.unshift(
    ...dedupeImports(imports, ctx),
    ...(hmrCache ? [getRenderFunctionsObject(renderFunctionsMap, hmrCache)] : []),
  )

  return hmrCache
    ? wrapperWithHmr(print(program).code, hmrCache)
    : print(program).code
}
