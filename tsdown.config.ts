import { join } from 'node:path'
import process from 'node:process'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  fixedExtension: true,
  dts: true,
  workspace: {
    include: ['packages/*'],
    exclude: ['playground', 'packages/docs'],
  },
  tsconfig: join(import.meta.dirname, 'tsconfig.json'),
  sourcemap: process.env.NODE_ENV === 'development',
})
