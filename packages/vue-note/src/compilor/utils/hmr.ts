import type { TransformHashCache } from '../../vite/transform'

export function getComponentHmrCode(uniqueId: string, cache: [TransformHashCache | undefined, TransformHashCache]): string {
  return `
_component.__hmrId = '${uniqueId}'
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_component.__hmrId, _component);
const _templateChanged = ${cache[1].template.get(uniqueId) !== cache[0]?.template.get(uniqueId)}
const _scriptChanged = ${cache[0]?.ast !== cache[1].ast}
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    if (_scriptChanged) {
      window.location.reload()
    } else {
      __VUE_HMR_RUNTIME__.rerender(_component.__hmrId, _component.render);
    }
  })
}
`
}
