import type { ExportNamedDeclaration, Function } from 'oxc-parser'

export interface CacheHash {
  ast: string
  template: Map<string, string>
}

export function getRenderFunctionsObject(renderFunctionsMap: Map<string, Function>, cache: [CacheHash | undefined, CacheHash]): ExportNamedDeclaration {
  const range = { start: 0, end: 0 }
  return {
    type: 'ExportNamedDeclaration',
    ...range,
    declaration: {
      type: 'VariableDeclaration',
      kind: 'const',
      ...range,
      declarations: [
        {
          type: 'VariableDeclarator',
          ...range,
          id: {
            type: 'Identifier',
            ...range,
            decorators: [],
            name: '__VUE_HMR_RENDER_FUNCTIONS__',
            optional: false,
            typeAnnotation: null,
          },
          init: {
            type: 'ObjectExpression',
            ...range,
            properties: Array.from(renderFunctionsMap).map(([key, func]) => {
              const _templateChanged = !!(cache[0] && cache[0]?.template.get(key) !== cache[1].template.get(key))

              return {
                type: 'Property',
                ...range,
                kind: 'init',
                key: {
                  type: 'Literal',
                  ...range,
                  value: `${key}`,
                  raw: `'${key}'`,
                },
                value: {
                  type: 'ObjectExpression',
                  ...range,
                  properties: [
                    {
                      type: 'Property',
                      ...range,
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        ...range,
                        decorators: [],
                        name: 'changed',
                        optional: false,
                        typeAnnotation: null,
                      },
                      value: {
                        type: 'Literal',
                        ...range,
                        value: _templateChanged,
                        raw: `${_templateChanged}`,
                      },
                      method: false,
                      shorthand: false,
                      computed: false,
                      optional: false,
                    },
                    {
                      type: 'Property',
                      ...range,
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        ...range,
                        decorators: [],
                        name: 'render',
                        optional: false,
                        typeAnnotation: null,
                      },
                      value: { ...func, type: 'FunctionExpression' },
                      method: false,
                      shorthand: false,
                      computed: false,
                      optional: false,
                    },
                  ],

                },
                method: false,
                shorthand: false,
                computed: false,
                optional: false,
              }
            }),
          },
        },
      ],
    },
    specifiers: [],
    source: null,
    exportKind: 'value',
    attributes: [],
  }
}

export function getComponentHmrCode(uniqueId: string): string {
  return `
_component.__hmrId = '${uniqueId}';
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_component.__hmrId, _component);
`
}

export function wrapperWithHmr(originalCode: string, cache: [CacheHash | undefined, CacheHash]): string {
  const __scriptChanged = !!(cache[0] && cache[0]?.ast !== cache[1].ast)

  return `
${originalCode}
export const __scriptChanged = ${__scriptChanged};
if(import.meta.hot){
  import.meta.hot.accept(async (mod)=>{
    if(!mod) return;
    if(mod.__scriptChanged) {
      return window.location.reload();
    }
    Object.keys(mod.__VUE_HMR_RENDER_FUNCTIONS__).forEach((id) => {
      const component = mod.__VUE_HMR_RENDER_FUNCTIONS__[id];
      if(component && component.changed) {
        __VUE_HMR_RUNTIME__.rerender(id, component.render);
      }
    });
  })
}`
}
