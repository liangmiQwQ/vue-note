/* eslint-disable unused-imports/no-unused-vars */
import { ref } from 'vue'
import { defineCommentComponent, defineTemplate } from 'vue-note'

const AppHome = defineCommentComponent(() => {
  const props = defineProps<{
    msg: string
  }>()

  defineTemplate(/* @template
    <h1> {{ props.msg }} </h1>
  */)
})

const Counter = defineCommentComponent(() => {
  const count = ref(0)
  const increase = (): any => count.value += 1

  defineTemplate(/* @template
    <label> Counter Counts: </label>
    <button @click='increase'>{{ count }}</button>
  */)
})

export default defineCommentComponent(() => {
  const message = ref('Good Morning')

  defineTemplate(/* @template
    <div> {{ message }} </div>
    <AppHome msg="Hello World! " />
    <Counter />
  */)
})
