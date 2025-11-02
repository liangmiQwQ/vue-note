import { fileURLToPath } from 'node:url'
import { DevTools } from '@vitejs/devtools'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VitePluginInspect from 'vite-plugin-inspect'
import { VueNote } from 'vue-note/vite'

export default defineConfig({
  plugins: [
    DevTools(),
    VitePluginInspect(),
    VueNote(),
    Vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      debug: { },
    },
  },
})
