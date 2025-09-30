/* eslint-disable unused-imports/no-unused-vars */
import { defineCommentComponents, defineTemplate } from 'vue-note'

export default defineCommentComponents(() => {
  defineTemplate(/* @template
    <AppHome msg="Hello World" />
  */)
})

const AppHome = defineCommentComponents(() => {
  const props = defineProps<{
    msg: string
  }>()

  defineTemplate(/* @template
    <h1> {{ props.msg }} </h1>
  */)
})
