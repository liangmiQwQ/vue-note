import { fileURLToPath } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VitePluginInspect from 'vite-plugin-inspect'
import { VueNote } from 'vue-note/vite'

export default defineConfig({
  plugins: [
    VitePluginInspect(),
    VueNote(),
    Vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
