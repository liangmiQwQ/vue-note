/* eslint-disable unused-imports/no-unused-vars */
import { defineCommentComponent, defineTemplate } from 'vue-note'

export default defineCommentComponent(() => {
  defineTemplate(/* @template
    <AppHome msg="Hello World" />
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
