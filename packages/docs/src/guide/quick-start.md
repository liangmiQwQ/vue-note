# Installation

::: warning
**Before starting use Vue Note, you should know the following tips:**

- Vue Note only supports **Vue 3.2.25+** with **Vite**.
- Vue Note currently only provides **TypeScript** support
:::

Run the following command to install Vue Note:
```bash
npm install -D vue-note
```

or with pnpm
```bash
pnpm add -D vue-note
```

And add the plugin in your `vite.config.ts`

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

Then, write Vue component anywhere you want!

```typescript
// main.ts

import { createApp } from 'vue'

createApp(defineCommentComponent(() => {
  defineTemplate(/* @template <h1>Hello World</h1> */)
})).mount('#app')
```

Or import it into the existing SFC

```vue
<script setup lang='ts'>
import { NavBar } from './narvbar'
</script>

<template>
  <NavBar user="Liang Mi" />
</template>
```
