# Api Reference

## Macros

::: warning
Please only call the macro in `.ts` file but not `.vue` or `.tsx` file, otherwise something unexpected may get happended.
:::

### `defineCommentComponent`

```typescript
import { defineCommentComponent } from 'vue-note'

declare function defineCommentComponent(component: () => void): Component
```

Can be used to define a component with Vue Note.

```typescript
import { defineCommentComponent, defineTemplate } from 'vue-note'

export default defineCommentComponent(() => {
  // Function body will turn into <script setup> part
  const msg = ref('Hello World')

  defineTemplate(/* @template
    <h1>{{ msg }}</h1>
  */)
})
```

The above code has the same behavior as the following SFC

```vue
<script setup lang='ts'>
const msg = ref('Hello World')
</script>

<template>
  <h1>{{ msg }}</h1>
</template>
```

### `defineTemplate`

```typescript
import { defineTemplate } from 'vue-note'

declare function defineTemplate(): void
```

Can be used to define template in a comment component. **Can be ONLY called in [`defineCommentComponent`](#definecommentcomponent) function body and for only ONE time**.

And although there is no params requires, you need to write the component with a JavaScript block comment(multi-line comment) in the following struct

```typescript
defineTemplate(/* @template<!--any template you want--> */)
```

or with any format

```typescript
defineTemplate(/* @template
  <!--any template you want-->
*/)
```

## Vite

### `VueNote`

Get the VueNote Vite plugin

```typescript
declare function VueNote(): PluginOption
```

and use it in [Vite Config](https://vite.dev/config/)

```typescript{3,7}
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { VueNote } from 'vue-note/vite'

export default defineConfig({
  plugins: [
    VueNote(),
    Vue(),
  ],
})

```
