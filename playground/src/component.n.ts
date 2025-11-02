/* eslint-disable unused-imports/no-unused-vars */
import { computed, defineProps } from 'vue'
import { defineCommentComponent, defineTemplate } from 'vue-note'

export default defineCommentComponent(() => {
  const props = defineProps<{ buttonName?: string }>()

  const MyButton = computed(() => props.buttonName
    ? defineCommentComponent(() => {
        defineTemplate(/* @template
          <button>My name is {{ props.buttonName }}</button>
        */)
      })
    : defineCommentComponent(() => {
        defineTemplate(/* @template
          <button>Hi, I am a button</button>
        */)
      }))

  defineTemplate(/* @template
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  */)
})
