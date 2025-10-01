import type { SFCScriptBlock } from 'vue/compiler-sfc'
import type { RawComponent } from './parse'
import process from 'node:process'
import { compileScript, parse } from 'vue/compiler-sfc'

export function parseComponents(filename: string, rawComponents: RawComponent[]): SFCScriptBlock[] {
  return rawComponents.map((e, index) => {
    const _vueSFC = generateSFC(e)

    const uniqueId = `${filename}_${index}`
    const uniqueFilename = `${filename}?component=${index}`

    const { descriptor } = parse(_vueSFC, { ignoreEmpty: false, sourceMap: false, filename: uniqueFilename })

    return compileScript(descriptor, {
      isProd: process.env.NODE_ENV === 'production',
      id: uniqueId,
      inlineTemplate: true,
      sourceMap: false,
      templateOptions: {
        source: descriptor.template!.content,
        filename: descriptor.filename,
        id: uniqueId,
      },
    })
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
