import { createElementBlock as _createElementBlock, defineComponent as _defineComponent, openBlock as _openBlock, toDisplayString as _toDisplayString, ref } from 'vue'

export default /* @__PURE__ */_defineComponent({
  props: {
    a: { type: Number, required: true },
  },
  setup(__props) {
    const msg = ref ('Good Morning! ')

    return (_ctx, _cache) => {
      return (_openBlock(), _createElementBlock('div', null, _toDisplayString(msg.value), 1 /* TEXT */))
    }
  },

})

export const AppHome = /* @__PURE__ */_defineComponent({
  props: {
    a: { type: Number, required: true },
  },
  setup(__props) {
    const msg = ref ('Good Morning! ')

    return (_ctx, _cache) => {
      return (_openBlock(), _createElementBlock('div', null, _toDisplayString(msg.value), 1 /* TEXT */))
    }
  },

})
