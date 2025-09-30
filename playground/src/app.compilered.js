import { createElementBlock as _createElementBlock, defineComponent as _defineComponent, openBlock as _openBlock, toDisplayString as _toDisplayString, ref } from 'vue'

export default /* @__PURE__ */_defineComponent({
  setup(__props, { expose: __expose }) {
    __expose()

    const msg = ref('Good Morning! ')

    const __returned__ = { msg }
    Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
    return __returned__
  },
  render(_ctx, _cache) {
    return (_openBlock(), _createElementBlock('div', null, _toDisplayString(_ctx.msg), 1 /* TEXT */))
  },
})

export const AppHome = /* @__PURE__ */_defineComponent({
  setup(__props, { expose: __expose }) {
    __expose()

    const msg = ref('Good Morning! ')

    const __returned__ = { msg }
    Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
    return __returned__
  },
  render(_ctx, _cache) {
    return (_openBlock(), _createElementBlock('div', null, _toDisplayString(_ctx.msg), 1 /* TEXT */))
  },
})
