import type { ImportDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier } from 'oxc-parser'
import type { Rollup } from 'vite'
import { walk } from 'oxc-walker'

export function dedupeImports(rawImports: ImportDeclaration[], ctx: Rollup.TransformPluginContext): ImportDeclaration[] {
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

  return imports
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
