// @ts-check
import antfu from '@antfu/eslint-config'

async function getConfig() {
  const config = await antfu(
    {
      type: 'lib',
      pnpm: true,
    },
  )

  // since @antfu/eslint-config doesn't provide override for pnpm option, map manually instead.
  return config.map((e) => {
    if (e.name === 'antfu/pnpm/package-json') {
      // @ts-ignore
      e.rules['pnpm/json-enforce-catalog'] = ['error', { autofix: false }]
    }

    return e
  })
}

export default getConfig()
