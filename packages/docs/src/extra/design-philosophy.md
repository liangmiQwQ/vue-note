# Design Philosophy

To make Vue Note easier to use, there are a few tips you'd better know when designing or making a new feature.

## Keep the original Vue experience

### What we want to achieve

We want developers to have a great experience when using Vue Note. The target is to **make it feel just like using regular Vue Single File Components (SFCs)**, or even **better**.

This means:
- **Full Vue.js compatibility**: All Vue.js features should work exactly the same way, even compile-time syntax, like `defineProps`, `defineEmits`
- **Third-party library support**: Any Vue library should work without any changes

### Why it is important

Vue.js has been tested by millions of developers. When we're not actually sure we have a better solution, **it's safer to use what the community already knows and trusts.** It is easier to change ourselves than to change the community.

Also, we hope developers should **be able to switch between Vue Note and regular Vue without learning too many new things**. This makes adoption easier and reduces worries about compatibility.

When we don't break existing syntax, developers don't need to find workarounds or learn special tricks. Everything just works the way they expect. **It also bring better DX.**

### How we make it work

Instead of rewriting everything, **we need to try to reuse the code what Vue or the community has already done**, for example, we use `@vue/compiler-sfc` instead of using `@vue/compiler-dom` to make sure all the macro and the scripts work the same as native Vue. It also bring us **less code for us to maintain and fewer bugs.**

However, if sometimes our code does change how Vue work. We also need to fix it to ensure the developer experience stays the same. Here is a example.

::: info An example of Component importing

In Vue Note, when you write a component like this:

```typescript
import { Button } from 'some-ui-library' // ⬅️ Outside

defineCommentComponent(() => {
  defineTemplate(/* @template
    <Button>Click me</Button> // ⬅️ Inside
  */)
})
```

The `Button` import is outside the component function, so Vue's compiler can't find it and may cause unexpected bug. This may break the developer experience. To fix this, we inject a fake import statement:

```typescript
import { Button } from 'vue-note'
```

and remove it later (after `vue/compiler-sfc` compiled)

This makes Vue's compiler think `Button` comes from `vue-note`, preserving the expected behavior without requiring developers to change their import patterns.

:::

Another important thing is that we need **good design**. For example, we don't wrap templates in template string because that would break how template strings work inside templates. We use the block JavaScript comment since Vue templates don't support regular JavaScript comments anyway.

In a word, the final goal is that we want Vue Note to feel like a **natural extension** of Vue.js, not a completely different framework. This makes it easier for developers to adopt and use in their projects.
