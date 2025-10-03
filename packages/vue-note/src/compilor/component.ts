import type { RawComponent } from './parse'
import process from 'node:process'
import { compileScript, parse } from 'vue/compiler-sfc'
import { getUniqueFilename, getUniqueID } from './utils/id'

export interface CompiledComponent {
  code: string
  id: string
  uniqueId: string
  uniqueFilename: string
}

export function parseComponents(filename: string, rawComponents: RawComponent[]): CompiledComponent[] {
  return rawComponents.map((e) => {
    const _vueSFC = generateSFC(e)

    const uniqueId = getUniqueID(filename, e.id)
    const uniqueFilename = getUniqueFilename(filename, e.id)

    const { descriptor } = parse(_vueSFC, { ignoreEmpty: false, sourceMap: false, filename: uniqueFilename })

    return {
      id: e.id,
      uniqueId,
      uniqueFilename,
      code: compileScript(descriptor, {
        isProd: process.env.NODE_ENV === 'production',
        id: uniqueId,
        inlineTemplate: true,
        sourceMap: false,
        templateOptions: {
          source: descriptor.template!.content,
          filename: descriptor.filename,
          id: uniqueId,
        },
      }).content,
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
