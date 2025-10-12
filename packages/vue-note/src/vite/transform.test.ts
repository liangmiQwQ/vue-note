import type { Rollup } from 'vite'
import type { TransformOption } from './transform'
import { describe, expect, it, vi } from 'vitest'
import { transform } from './transform'

function createMockContext(): Rollup.TransformPluginContext {
  return {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    getCombinedSourcemap: vi.fn(),
  } as any
}

function createMockServer(isProduction = false, hmr = false): TransformOption {
  return {
    isProduction,
    server: { config: { server: { hmr } } },
  } as any
}

const testScript = `
import { ref } from 'vue'
import { defineCommentComponent, defineTemplate } from 'vue-note'

export default defineCommentComponent(() => {
  const message = ref('Good Morning')

  defineTemplate(/* @template
    <div> {{ message }} </div>
    <div> Hello World </div>
  */)
})
`

describe('production', () => {
  it('should work in production', async () => {
    expect(await transform(testScript, `test.ts`, createMockContext(), {}, false, createMockServer(true, false))).toMatchSnapshot()
  })

  it('should work with style imports', async () => {
    expect(await transform(`import 'style.css'; \n ${testScript}`, `test.ts`, createMockContext(), {}, false, createMockServer(true, false))).toMatchSnapshot()
  })
})

describe('development', () => {
  it('should work and inject HMR code', async () => {
    expect(await transform(testScript, `test.ts`, createMockContext(), {}, false, createMockServer(false, true))).toMatchSnapshot()
  })

  it('should detect script change and inject HMR code', async () => {
    const first = await transform(testScript, `test.ts`, createMockContext(), {}, false, createMockServer(false, true))

    const second = await transform(testScript.replace('Good Morning', 'Good Afternoon'), `test.ts`, createMockContext(), {}, false, createMockServer(false, true), first.cache)
    expect(second.result?.code).toContain('const __scriptChanged = true;')
    expect(second.result?.code).not.toContain('changed: true,')
  })

  it('should detect template change and inject HMR code', async () => {
    const first = await transform(testScript, `test.ts`, createMockContext(), {}, false, createMockServer(false, true))

    const second = await transform(testScript.replace('Hello World', 'Hello Vue Note'), `test.ts`, createMockContext(), {}, false, createMockServer(false, true), first.cache)
    expect(second.result?.code).not.toContain('const __scriptChanged = true;')
    expect(second.result?.code).toContain('changed: true,')
  })
})
