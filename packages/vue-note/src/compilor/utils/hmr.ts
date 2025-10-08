export interface CacheHash {
  ast: string
  template: Map<string, string>
}

export function getComponentHmrCode(uniqueId: string, cache: [CacheHash | undefined, CacheHash]): string {
  // const range = { start: 0, end: 0 }
  const _templateChanged = cache[1].template.get(uniqueId) !== cache[0]?.template.get(uniqueId)

  return `
_component.__hmrId = '${uniqueId}';
_component._templateChanged = ${_templateChanged};
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_component.__hmrId, _component);
__componentsMap.set(_component.__hmrId, _component)
if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    const __component = mod?.__componentsMap.get(_component.__hmrId)
    if(__component && __component._templateChanged) {
      __VUE_HMR_RUNTIME__.rerender(__component.__hmrId, __component.render);
    }
  })
}
`
}

export function wrapperWithHmr(originalCode: string, cache: [CacheHash | undefined, CacheHash]): string {
  const __scriptChanged = cache[0]?.ast !== cache[1].ast

  return `
const __componentsMap = new Map();
${originalCode}
export const __scriptChanged = ${__scriptChanged};
if(import.meta.hot){
  import.meta.hot.accept((mod)=>{
    if(mod && mod.__scriptChanged) {
      window.location.reload();
    }
  })
}
export { __componentsMap }`
}
