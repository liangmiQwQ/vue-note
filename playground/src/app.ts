/* eslint-disable unused-imports/no-unused-vars */
import { ref } from 'vue'
import { defineCommentComponent, defineTemplate } from 'vue-note'

export default defineCommentComponent(() => {
  const message = ref('Good Morning')

  defineTemplate(/* @template
    <div> {{ message }} </div>
  */)
})

const AppHome = defineCommentComponent(() => {
  const props = defineProps<{
    msg: string
  }>()

  defineTemplate(/* @template
    <h1> {{ props.msg }} </h1>
  */)
})
