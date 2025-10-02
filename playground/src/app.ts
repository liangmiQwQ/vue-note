/* eslint-disable unused-imports/no-unused-vars */
import { defineCommentComponent, defineTemplate } from 'vue-note'

export default defineCommentComponent(() => {
  defineTemplate(/* @template
    <AppHome msg="Hello World" />
    <div>Good Morning</div>
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
