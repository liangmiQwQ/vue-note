# What is Vue Note?

**Vue Note** provides a new way to write **Vue components**. It allows you to define Vue components **directly in TypeScript/JavaScript files**.

Here is a mini example:

```typescript
import { defineCommentComponent, defineTemplate } from 'vue-note'

export default defineCommentComponent(() => {
  defineTemplate(/* @template
    <main>Hello World</main>
  */)
})
```

## Why we need another style to write Vue?

Vue has already provided a excellent and effecient way to build application through [Single File Components (SFCs)](https://vuejs.org/guide/scaling-up/sfc.html). It's clean, structured most of the time.

However, as projects grow **larger or more complex**, some developers may find it **inflexible** to always define component in `.vue` files.

::: info *Real-world* example: you are trying building a `Card` component for unified ui. You need to create a directory like this:

```log
components/Card
├── Card.vue
├── CardContent.vue
├── CardDescription.vue
├── CardFooter.vue
├── CardHeader.vue
├── CardTitle.vue
└── index.ts
```

And export all of them at `index.ts` after writing the component codes in these six files

```typescript
export { default as Card } from './Card.vue'
export { default as CardContent } from './CardContent.vue'
export { default as CardDescription } from './CardDescription.vue'
export { default as CardFooter } from './CardFooter.vue'
export { default as CardHeader } from './CardHeader.vue'
export { default as CardTitle } from './CardTitle.vue'
```

This is the thing what [ShadCN Vue](https://github.com/unovue/shadcn-vue/tree/a8f4019014c52bb28210769a410d929a9fc6a9af/apps/www/src/registry/default/ui/card) are actually doing, Maybe it is still not bad for 7 component, but if we need to build a [SideBar](https://github.com/unovue/shadcn-vue/tree/a8f4019014c52bb28210769a410d929a9fc6a9af/apps/www/src/registry/default/ui/sidebar) with more than 10 or 20 components?

This can lead to higher maintenance overhead and scattered logic across multiple files.
:::

How to make it better? There are some possible solutions:

- [Vue Vine](https://vue-vine.dev/) provides a fantastic way to make components by defining function. However, it still comes with flexibility limitations and design choices that developers need to adapt to. For example, it has its own way to defining props and have special rules on template strings, which may need time to learn and switch for developers.
- [Vue JSX](https://github.com/vuejs/babel-plugin-jsx) provides the flexibility of JSX for component construction, but developers may need to adapt to a different mental model compared to Vue's template-first approach. Additionally, some compile-time performance trade-offs should be considered when opting for JSX.
- Vue Note

Inspired by [Vue Vine](https://vue-vine.dev/), Vue Note allows you **write components as JavaScript expressions**, much like JSX in React, but with Vue's template reactivity and compiler optimizations.

You can even define a component in another component *(Although this is not recommended in most cases)*

```typescript
import { defineProps } from 'vue'
import { defineCommentComponent, defineTemplate } from 'vue-note'

export default defineCommentComponent(() => {
  const props = defineProps<{ name: string }>()

  const MyButton = defineCommentComponent(() => {
    defineTemplate(/* @template
      <button>Hi, I am a button</button>
    */)
  })

  defineTemplate(/* @template
    <div>
      <h1>Hi {{ props.name }}, Hello World! </h1>
      <MyButton />
    </div>
  */)
})
```

Learn more about our **flexibility approach** in [Flexibility](/advenced/flexibility) and our **design philosophy** in [Design Philosophy](/extra/design-philosophy).
