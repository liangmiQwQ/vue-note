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
__components.push(_component)
`
}

export function wrapperWithHmr(originalCode: string, cache: [CacheHash | undefined, CacheHash]): string {
  const __scriptChanged = cache[0]?.ast !== cache[1].ast

  return `
const __components = {
  componentNumber: 2,
  components: [],
  _resolve: null,
  _timeoutId: null,
  push(e) {
    this.components.push(e);
    if (this.components.length >= this.componentNumber && this._resolve) {
      clearTimeout(this._timeoutId);
      this._resolve(this.components);
    }
  }
};
__components.promise = new Promise((resolve, reject) => {
  __components._resolve = resolve;
  __components._timeoutId = setTimeout(() => {
    resolve(null);
  }, 500);
  if (__components.components.length >= __components.componentNumber) {
    resolve(__components.components);
  }
});
${originalCode}
export const __scriptChanged = ${__scriptChanged};
if(import.meta.hot){
  import.meta.hot.accept(async (mod)=>{
    if(!mod) return;
    if(mod.__scriptChanged) {
      return window.location.reload();
    }
    const components = await mod.__components.promise;
    if(components){
      components.forEach((component) => {
        if(component && component._templateChanged) {
          __VUE_HMR_RUNTIME__.rerender(component.__hmrId, component.render);
        }
      });
    } else {
      window.location.reload();
    }
  })
}
export { __components }`
}
