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

## Why Vue Note?

Vue's [Single File Components (SFCs)](https://vuejs.org/guide/scaling-up/sfc.html) are powerful and intuitive, but they may introduce challenges in some situations, such as file overhead when creating many small components or dynamic component creation in complex applications.

While solutions like [Vue Vine](https://vue-vine.dev) have explored ways to address these issues by enabling multiple components in a single file, Vue Note takes inspiration from Vue Vine and goes further to offer a flexible, experimental tool that enhances Vue's ecosystem.

Vue Note is designed as a complement to Vue's existing tools, not a replacement. It shines in scenarios where traditional SFCs feel cumbersome, such as when you need lightweight, inline components or want to reduce file overhead. Here is an example of a dynamic button component in Vue Note, showcasing its ability to define components concisely:

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

## What Makes Vue Note Special?

Inspired by Vue Vine, Vue Note builds on the idea of flexible component creation while addressing some of Vue Vine's limitations. Unlike Vue Vine, which focuses on multi-component files, Vue Note offers:

- Template string support: Write templates using concise, inline strings for rapid prototyping.
- Full macro compatibility: Seamlessly use Vue's `defineProps`, `defineEmits`, and other macros you like.
- True inline components: Define components anywhere in your code, reducing the need for separate files.
- Seamless Vue ecosystem integration: Retain Vue's reactivity and compiler optimizations without compromise.

Learn more about our **flexibility approach** in [Flexibility](/guide/flexibility) and our **design philosophy** in [Design Philosophy](/extra/design-philosophy).
