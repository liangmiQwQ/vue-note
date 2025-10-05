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

Have you noticed the **competition** between [Vue](https://vuejs.org/) and [React](https://react.dev)?

Some developers believe the core reason for React's popularity is its **flexibility**. React is built on top of **JSX**, and writing JSX is essentially writing JavaScript — you can treat any JSX expression as a regular JavaScript expression.

```tsx
export default function MyApp({ buttonName }) {
  const MyButton = buttonName
    ? (
        <button>
          My name is
          { buttonName }
        </button>
      )
    : (
        <button>Hi, I am a button</button>
      )

  return (
    <div>
      <h1>Welcome to my app</h1>
      { MyButton }
    </div>
  )
}
```

What about Vue? Vue is **more focused on compiler optimizations** to make the runtime environment faster, so it needs a **more stable structure** (SFC). However, this comes at the cost of **flexibility** — something crucial for large or complex projects.

There have been attempts to make Vue more flexible. For example, [Vue JSX](https://github.com/vuejs/babel-plugin-jsx) allows writing JSX that compiles to Vue, and [Vue Vine](https://vue-vine.dev) enables writing multiple components in a single file.
But the former doesn't perform as well as native Vue, while the latter's flexibility is still limited and sacrifices some native Vue features.

That's why **Vue Note** was created. You can write the same functionality as the JSX example above, but with **native Vue's DX, reactivity and performance**:

```typescript
import { defineProps } from 'vue'
import { defineCommentComponent, defineTemplate } from 'vue-note'

export default defineCommentComponent(() => {
  const props = defineProps<{ buttonName?: string }>()

  const MyButton = props.buttonName
    ? defineCommentComponent(() => {
        defineTemplate(/* @template
          <button>My name is { props.buttonName }</button>
        */)
      })
    : defineCommentComponent(() => {
        defineTemplate(/* @template
          <button>Hi, I am a button</button>
        */)
      })

  defineTemplate(/* @template
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  */)
})
```

In **Vue Note**, a component is a **JavaScript expression** — just like in JSX, but backed by **Vue's reactivity system** and **compiler optimizations**.

Learn more about our **flexibility approach** in [Flexibility](/guide/flexibility) and our **design philosophy** in [Design Philosophy](/extra/design-philosophy).
