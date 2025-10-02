import type { ExportDefaultDeclarationKind, ImportDeclaration, Program } from 'oxc-parser'
import type { CompiledComponent } from './component'
import { parseSync, Visitor } from 'oxc-parser'
import { walk } from 'oxc-walker'
import { print } from 'recast'
import { getID } from './utils/id'

export function resolve(program: Program, compiledComponents: CompiledComponent[]): string {
  const imports: ImportDeclaration[] = []

  walk(program, {
    enter(node) {
      // replace defineCommentComponent to compiled component
      if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'defineCommentComponent') {
        const _script = compiledComponents.find(e => e.id === getID(node))!

        let script: ExportDefaultDeclarationKind | undefined

        new Visitor({
          ExportDefaultDeclaration(decl) {
            script = decl.declaration
          },
          ImportDeclaration(decl) {
            // collect imports
            imports.push(decl)
          },
        }).visit(parseSync('foo.ts', _script.code).program)

        this.replace(script!)
      }

      // remove macro imports
      if (node.type === 'ImportSpecifier' && node.imported.type === 'Identifier' && (node.imported.name === 'defineCommentComponent' || node.imported.name === 'defineTemplate')) {
        this.remove()
      }
    },
  })

  program.body.unshift(...imports)

  return print(program).code
}
