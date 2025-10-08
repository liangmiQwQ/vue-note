/* eslint-disable unused-imports/no-unused-vars */
import { ref } from 'vue'
import { defineCommentComponent, defineTemplate } from 'vue-note'

export default defineCommentComponent(() => {
  const InlineComponent = defineCommentComponent(() => {
    const msg = ref('HMR Inline Component Test')

    defineTemplate(/* @template
      <div> {{ msg }} </div>
      <div> HMR Inline Component Static Content </div>
    */)
  })

  defineTemplate(/* @template
    <div> HMR Test </div>
    <InlineComponent />
  */)
})
