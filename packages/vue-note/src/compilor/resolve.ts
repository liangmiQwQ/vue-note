import type { ExportDefaultDeclarationKind, ImportDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier, Program } from 'oxc-parser'
import type { Rollup } from 'vite'
import type { CompiledComponent } from './component'
import { parseSync, Visitor } from 'oxc-parser'
import { walk } from 'oxc-walker'
import { print } from 'recast'
import { getID } from './utils/id'

export function resolve(program: Program, compiledComponents: CompiledComponent[], ctx: Rollup.TransformPluginContext): string {
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
      if (node.type === 'ImportDeclaration') {
        if (node.source.value !== 'vue-note') {
          // other imports
          imports.push(node)
        }

        this.remove()
      }
    },
  })

  program.body.unshift(...dedupeImports(imports, ctx))

  return print(program).code
}

function dedupeImports(imports: ImportDeclaration[], ctx: Rollup.TransformPluginContext): ImportDeclaration[] {
  const identifierMap = new Map<string, string>() // e.local.name; e.imported.name

  imports.forEach((decl) => {
    walk(decl, {
      enter(e) {
        if (e.type === 'ImportSpecifier' || e.type === 'ImportDefaultSpecifier' || e.type === 'ImportNamespaceSpecifier') {
          const imported = identifierMap.get(e.local.name)
          if (imported && imported !== getImported(e, decl)) {
            // imported with the same identifier, but the imported things are different
            ctx.error(`${e.local.name} is a reserved keyword, please rename it.`)
          }
          else if (!imported) { // the new
            identifierMap.set(e.local.name, getImported(e, decl))
          }
          else {
            this.remove()
          }
        }
      },
    })
  })

  return imports.filter(decl => decl.specifiers && decl.specifiers.length > 0)
}

function getImported(node: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier, parent: ImportDeclaration): string {
  if (node.type === 'ImportSpecifier') {
    // e.g. import { ref } from 'vue'
    return `${parent.source.value}\\${node.imported.type === 'Identifier' ? node.imported.name : node.imported.value}`
  }
  else if (node.type === 'ImportNamespaceSpecifier') {
    // e.g. import * as _compiler from 'vue/compiler-sfc'
    return `${parent.source.value}\\*`
  }
  else {
    // e.g. import UnoCSS from 'unocss';
    return `${parent.source.value}\\DEFAULT`
  }
}
