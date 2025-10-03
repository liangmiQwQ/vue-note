import type { RawComponent } from './parse'
import process from 'node:process'
import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc'
import { getUniqueFilename, getUniqueID } from './utils/id'

export interface CompiledComponent {
  code: {
    main: string
    template?: string
  }
  id: string
  uniqueId: string
  uniqueFilename: string
}

export function parseComponents(filename: string, rawComponents: RawComponent[], detached: boolean): CompiledComponent[] {
  return rawComponents.map((e) => {
    const _vueSFC = generateSFC(e)

    const uniqueId = getUniqueID(filename, e.id)
    const uniqueFilename = getUniqueFilename(filename, e.id)

    const { descriptor } = parse(_vueSFC, { ignoreEmpty: false, sourceMap: false, filename: uniqueFilename })

    const script = compileScript(descriptor, {
      isProd: process.env.NODE_ENV === 'production',
      id: uniqueId,
      sourceMap: false,
      inlineTemplate: !detached,
      templateOptions: !detached
        ? {
            source: descriptor.template!.content,
            filename: descriptor.filename,
            id: uniqueId,
          }
        : undefined,
    })
    const code = {
      main: script.content,
      template: detached
        ? compileTemplate({
          source: descriptor.template!.content,
          filename: descriptor.filename,
          id: uniqueId,
          compilerOptions: {
            bindingMetadata: script.bindings, // Bind script
          },
        }).code
        : undefined,
    }

    return {
      id: e.id,
      uniqueId,
      uniqueFilename,
      code,
    }
  })
}

function generateSFC(rawComponent: RawComponent): string {
  return `<script setup lang='ts'>
${rawComponent.script}
</script>
<template>
${rawComponent.template}
</template>`
}
