/* eslint-disable ts/explicit-function-return-type */
/* eslint-disable unused-imports/no-unused-vars */
import { ref } from 'vue'
import { defineCommentComponent, defineTemplate } from 'vue-note'
import '../style.css'

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

  const Component = defineCommentComponent(() => {
    defineTemplate(/* @template
      <h1>Good Morning</h1>
    */)
  })

  const BUTTON_NAME_LIST = [undefined, 'Mike', 'Cindy']
  const buttonName = ref()

  function handleButtonName() {
    buttonName.value = BUTTON_NAME_LIST[BUTTON_NAME_LIST.findIndex(e => e === buttonName.value) + 1]
  }

  defineTemplate(/* @template
    <div> {{ message }} </div>
    <AppHome msg="Hello World! " />
    <Counter />
  */)
})
