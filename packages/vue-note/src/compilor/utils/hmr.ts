export interface CacheHash {
  ast: string
  template: Map<string, string>
}

export function getComponentHmrCode(uniqueId: string, cache: [CacheHash | undefined, CacheHash]): string {
  // const range = { start: 0, end: 0 }
  const _templateChanged = cache[1].template.get(uniqueId) !== cache[0]?.template.get(uniqueId)
  const _scriptChanged = cache[0]?.ast !== cache[1].ast

  // return ''
  return `
_component.__hmrId = '${uniqueId}';
_component._templateChanged = ${_templateChanged};
_component._scriptChanged = ${_scriptChanged};
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_component.__hmrId, _component);
__componentsMap.set(_component.__hmrId, _component)
if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    if(!mod) { 
      return
    }
    const __component = mod.__componentsMap.get(_component.__hmrId)
    if(!__component) { 
      return
    }
    if (__component._scriptChanged) {
      window.location.reload();
    } else if(__component._templateChanged) {
      __VUE_HMR_RUNTIME__.rerender(__component.__hmrId, __component.render);
    }
  })
}
`
}
