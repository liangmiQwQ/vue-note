import type { Expression, ImportDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier, Program } from 'oxc-parser'
import type { Rollup } from 'vite'
import type { TransformHashCache } from '../vite/transform'
import type { CompiledComponent } from './component'
import { parseSync, Visitor } from 'oxc-parser'
import { walk } from 'oxc-walker'
import { print } from 'recast'
import { getComponentHmrCode } from './utils/hmr'
import { getID } from './utils/id'
import { wrapperComponent } from './utils/wrapper'

export function resolve(program: Program, compiledComponents: CompiledComponent[], ctx: Rollup.TransformPluginContext, hmrCache: [TransformHashCache | undefined, TransformHashCache] | false): string {
  const imports: ImportDeclaration[] = []

  walk(program, {
    enter(node) {
      // replace defineCommentComponent to compiled component
      if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'defineCommentComponent') {
        const _script = compiledComponents.find(e => e.id === getID(node))!

        let script: Expression | undefined

        new Visitor({
          ExportDefaultDeclaration(decl) {
            script = decl.declaration as Expression
          },
          ImportDeclaration(decl) {
            // collect imports
            imports.push(decl)
          },
        }).visit(parseSync('foo.ts', _script.code).program)

        this.replace(wrapperComponent(script!, hmrCache ? getComponentHmrCode(_script.uniqueId, hmrCache) : []))
      }

      // remove macro imports
      if (node.type === 'ImportDeclaration') {
        if (!isPlaceholder(node)) {
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

function dedupeImports(rawImports: ImportDeclaration[], ctx: Rollup.TransformPluginContext): ImportDeclaration[] {
  const identifierMap = new Map<string, string>() // e.local.name; e.imported.name

  const imports = rawImports.filter(decl => !isPlaceholder(decl))
  imports.forEach((decl) => {
    walk(decl, {
      enter(e) {
        if (e.type === 'ImportSpecifier' || e.type === 'ImportDefaultSpecifier' || e.type === 'ImportNamespaceSpecifier') {
          const imported = identifierMap.get(e.local.name)
          if (imported && imported !== getImportedUniqueID(e, decl)) {
            // imported with the same identifier, but the imported things are different
            ctx.error(`${e.local.name} is a reserved keyword, please rename it.`)
          }
          else if (!imported) { // the new
            identifierMap.set(e.local.name, getImportedUniqueID(e, decl))
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

function getImportedUniqueID(node: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier, parent: ImportDeclaration): string {
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

function isPlaceholder(node: ImportDeclaration): boolean {
  return node.source.value === 'vue-note'
}
