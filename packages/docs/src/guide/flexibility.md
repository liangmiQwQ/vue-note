# Flexibility

Because of the design of Vue Note, every component can be **regarded as a JavaScript experssion**, it allows you to achieve similar effects as JSX similar but in Vue, it brings **more flexibility but also more performance traps**. Here are some tips and examples may help you to learn how to use Vue Note properly.

## Keep balance between performance and flexibility

Although Vue Note provides a flxeibile way to write component, It's also **really important** to understand the performance implications. Using `defineCommentComponent` the wrong way can make your app slow.

### Bad Example: Making Components Too Often

Here's what **not to do**. The `defineCommentComponent` runs again every time foo changes:

```typescript
export default defineCommentComponent(() => {
  const props = defineProps<{ foo: boolean }>()

  const DynamicComponent = computed(() =>
    props.foo
      ? defineCommentComponent(() => {
          defineTemplate(/* @template
          <h1> foo </h1>
        */)
        })
      : defineCommentComponent(() => {
          defineTemplate(/* @template
          <h1> not foo </h1>
        */)
        })
  )

  defineTemplate(/* @template
    <DynamicComponent />
  */)
})
```

### Better Way: Use `v-if` and `v-else`

Here's a good solution using `v-if` and `v-else`:

```typescript
export default defineCommentComponent(() => {
  const props = defineProps<{ foo: boolean }>()

  const DynamicComponent = defineCommentComponent(() => {
    defineTemplate(/* @template
      <h1 v-if='props.foo'> foo </h1>
      <h1 v-else> not foo </h1>
    */)
  })

  defineTemplate(/* @template
    <DynamicComponent />
  */)
})
```

### Or Even Simpler:

```typescript
export default defineCommentComponent(() => {
  const props = defineProps<{ foo: boolean }>()

  defineTemplate(/* @template
    <h1 v-if="props.foo">foo</h1>
    <h1 v-else>not foo</h1>
  */)
})
```

### The Main Rule

Try to run `defineCommentComponent` as few times as possible:

- Define components at the top level if possible
- Use `v-if` and `v-else` to show/hide things if possible
- **Don't** define components inside computed or watch unless you know what you are doing
- **Don't** make new components when data changes unless you know what you are doing

This way your app stays fast but still does what you want!

## Examples

Here are some examples about how to use Vue Note with good performance and comfortable flexibility

If you have also some good examples, you can contribute your code by [editing this page.](https://github.com/liangmiQwQ/vue-note/edit/main/packages/docs/src/guide/flexibility.md)

### Making a `Card` component

```typescript
import { defineCommentComponent } from 'vue-note'

export const Card = {
  wrapper: defineCommentComponent(/* Your component... */),
  header: defineCommentComponent(/* Your component... */),
  description: defineCommentComponent(/* Your component... */),
  body: defineCommentComponent(/* Your component... */),
  footer: defineCommentComponent(/* Your component... */),
}
```

```vue
<script lang='ts' setup>
import { Button } from './button'
import { Card } from './card'
import UserInformation from './UserInformation.vue'
</script>

<template>
  <Card.wrapper>
    <Card.header>User Info</Card.header>
    <Card.description>Edit your personal information</Card.description>
    <Card.body>
      <UserInformation />
    </Card.body>
    <Card.footer>
      <Button.default>Save</Button.default>
      <Button.secondary>Cancel</Button.secondary>
    </Card.footer>
  </Card.wrapper>
</template>
```

### Conditional Complex UI Components

> Forked from [Vite Devtools](https://github.com/vitejs/devtools/blob/59bc9ed77aa56ff3a6c70e01267af4ddb1288031/packages/vite/src/app/pages/session/%5Bsession%5D.vue)

```typescript
const panels = {
  module: defineCommentComponent(/* your component */),
  asset: defineCommentComponent(/* your component */),
  plugin: defineCommentComponent(/* your component */),
  chunk: defineCommentComponent(/* your component */),
}

function useDetailsPanel() {
  const router = useRouter()
  const route = useRoute()

  const currentPanelType = computed(() =>
    Object.keys(panels).find(
      key => typeof route.query[key] !== 'undefined'
    )
  )
  const CurrentPanel = computed(() =>
    currentPanelType.value
    && panels[currentPanelType.value]
  )

  function closeCurrentPanel() {
    if (currentPanelType.value) {
      router.replace({ query: {
        ...route.query,
        [currentPanelType.value]: undefined
      } })
    }
  }

  return {
    data: route.query[currentPanelType],
    CurrentPanel,
    closeCurrentPanel
  }
}
```

```vue
<script setup lang="ts">
const { data, CurrentPanel, closeCurrentPanel } = useDetailsPanel()

onKeyDown('Escape', (e) => {
  e.preventDefault()

  if (!e.isTrusted || e.repeat)
    return

  closeCurrentPanel()
})
</script>

<template>
  <div
    v-if="currentPanelType" fixed inset-0
    backdrop-blur-8 backdrop-brightness-95 z-panel-content
    @click.self="closeCurrentPanel"
  >
    <CurrentPanel :data />
  </div>
</template>
```
