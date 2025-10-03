export function getHmrCode(uniqueId: string): string {
  return `
_component.__hmrId = '${uniqueId}'
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_component.__hmrId, _component);
`
}
