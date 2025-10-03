import type { TransformHashCache } from '../../vite/transform'

export function getComponentHmrCode(uniqueId: string, cache: [TransformHashCache | undefined, TransformHashCache]): string {
  let hmrCode = ''

  if (cache[0]?.ast === cache[1].ast) {
    // template only
    hmrCode = `const _templateChanged = ${cache[1].template.get(uniqueId) !== cache[0]?.template.get(uniqueId)}
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    if(_templateChanged){
      __VUE_HMR_RUNTIME__.rerender(_component.__hmrId, _component.render);
    }
  })
}
`
  }

  return `
_component.__hmrId = '${uniqueId}'
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_component.__hmrId, _component);
${hmrCode}
`
}

export function getFileHmrCode(): string {
  return `

`
}
