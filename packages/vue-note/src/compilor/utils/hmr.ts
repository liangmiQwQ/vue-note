export function getComponentHmrCode(uniqueId: string): string {
  return `
_component.__hmrId = '${uniqueId}'
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_component.__hmrId, _component);

if (import.meta.hot) {
  // import.meta.hot.accept(() => {
    // if (_rerender_only) {
    //  __VUE_HMR_RUNTIME__.rerender(_component.__hmrId, _component.render);
    // } else {
    //  __VUE_HMR_RUNTIME__.reload(_component.__hmrId, _component);
    // }
  // });
}
`
}

export function getFileHmrCode(): string {
  return `

`
}
