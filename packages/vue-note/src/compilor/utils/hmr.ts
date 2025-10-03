import type { Directive, Statement } from 'oxc-parser'
import type { TransformHashCache } from '../../vite/transform'

export function getComponentHmrCode(uniqueId: string, cache: [TransformHashCache | undefined, TransformHashCache]): (Statement | Directive) [] {
  const range = { start: 0, end: 0 }
  const _templateChanged = cache[1].template.get(uniqueId) !== cache[0]?.template.get(uniqueId)
  const _scriptChanged = cache[0]?.ast !== cache[1].ast

  /* Orginal
  return `
_component.__hmrId = '${uniqueId}'
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_component.__hmrId, _component);
const _templateChanged = ${cache[1].template.get(uniqueId) !== cache[0]?.template.get(uniqueId)}
const _scriptChanged = ${cache[0]?.ast !== cache[1].ast}
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    if (_scriptChanged) {
      window.location.reload()
    } else {
      __VUE_HMR_RUNTIME__.rerender(_component.__hmrId, _component.render);
    }
  })
}
`
  */
  return [
    {
      type: 'ExpressionStatement',
      ...range,
      expression: {
        type: 'AssignmentExpression',
        ...range,
        operator: '=',
        left: {
          type: 'MemberExpression',
          ...range,
          object: {
            type: 'Identifier',
            ...range,
            decorators: [],
            name: '_component',
            optional: false,
            typeAnnotation: null,
          },
          property: {
            type: 'Identifier',
            ...range,
            decorators: [],
            name: '__hmrId',
            optional: false,
            typeAnnotation: null,
          },
          optional: false,
          computed: false,
        },
        right: {
          type: 'Literal',
          ...range,
          value: uniqueId,
          raw: `'${uniqueId}'`,
        },
      },
      directive: null,
    },
    {
      type: 'VariableDeclaration',
      ...range,
      kind: 'const',
      declarations: [
        {
          type: 'VariableDeclarator',
          ...range,
          id: {
            type: 'Identifier',
            ...range,
            decorators: [],
            name: '_templateChanged',
            optional: false,
            typeAnnotation: null,
          },
          init: {
            type: 'Literal',
            ...range,
            value: _templateChanged,
            raw: `${_templateChanged}`,
          },
          definite: false,
        },
      ],
      declare: false,
    },
    {
      type: 'VariableDeclaration',
      ...range,
      kind: 'const',
      declarations: [
        {
          type: 'VariableDeclarator',
          ...range,
          id: {
            type: 'Identifier',
            ...range,
            decorators: [],
            name: '_scriptChanged',
            optional: false,
            typeAnnotation: null,
          },
          init: {
            type: 'Literal',
            ...range,
            value: _scriptChanged,
            raw: `${_scriptChanged}`,
          },
          definite: false,
        },
      ],
      declare: false,
    },
    {
      type: 'ExpressionStatement',
      ...range,
      expression: {
        type: 'LogicalExpression',
        ...range,
        left: {
          type: 'BinaryExpression',
          ...range,
          left: {
            type: 'UnaryExpression',
            ...range,
            operator: 'typeof',
            argument: {
              type: 'Identifier',
              ...range,
              decorators: [],
              name: '__VUE_HMR_RUNTIME__',
              optional: false,
              typeAnnotation: null,
            },
            prefix: true,
          },
          operator: '!==',
          right: {
            type: 'Literal',
            ...range,
            value: 'undefined',
            raw: '"undefined"',
          },
        },
        operator: '&&',
        right: {
          type: 'CallExpression',
          ...range,
          callee: {
            type: 'MemberExpression',
            ...range,
            object: {
              type: 'Identifier',
              ...range,
              decorators: [],
              name: '__VUE_HMR_RUNTIME__',
              optional: false,
              typeAnnotation: null,
            },
            property: {
              type: 'Identifier',
              ...range,
              decorators: [],
              name: 'createRecord',
              optional: false,
              typeAnnotation: null,
            },
            optional: false,
            computed: false,
          },
          typeArguments: null,
          arguments: [
            {
              type: 'MemberExpression',
              ...range,
              object: {
                type: 'Identifier',
                ...range,
                decorators: [],
                name: '_component',
                optional: false,
                typeAnnotation: null,
              },
              property: {
                type: 'Identifier',
                ...range,
                decorators: [],
                name: '__hmrId',
                optional: false,
                typeAnnotation: null,
              },
              optional: false,
              computed: false,
            },
            {
              type: 'Identifier',
              ...range,
              decorators: [],
              name: '_component',
              optional: false,
              typeAnnotation: null,
            },
          ],
          optional: false,

        },
      },
      directive: null,
    },
    {
      type: 'IfStatement',
      ...range,
      test: {
        type: 'MemberExpression',
        ...range,
        object: {
          type: 'MetaProperty',
          ...range,
          meta: {
            type: 'Identifier',
            ...range,
            decorators: [],
            name: 'import',
            optional: false,
            typeAnnotation: null,
          },
          property: {
            type: 'Identifier',
            ...range,
            decorators: [],
            name: 'meta',
            optional: false,
            typeAnnotation: null,
          },
        },
        property: {
          type: 'Identifier',
          ...range,
          decorators: [],
          name: 'hot',
          optional: false,
          typeAnnotation: null,
        },
        optional: false,
        computed: false,
      },
      consequent: {
        type: 'BlockStatement',
        ...range,
        body: [
          {
            type: 'ExpressionStatement',
            ...range,
            expression: {
              type: 'CallExpression',
              ...range,
              callee: {
                type: 'MemberExpression',
                ...range,
                object: {
                  type: 'MemberExpression',
                  ...range,
                  object: {
                    type: 'MetaProperty',
                    ...range,
                    meta: {
                      type: 'Identifier',
                      ...range,
                      decorators: [],
                      name: 'import',
                      optional: false,
                      typeAnnotation: null,
                    },
                    property: {
                      type: 'Identifier',
                      ...range,
                      decorators: [],
                      name: 'meta',
                      optional: false,
                      typeAnnotation: null,
                    },
                  },
                  property: {
                    type: 'Identifier',
                    ...range,
                    decorators: [],
                    name: 'hot',
                    optional: false,
                    typeAnnotation: null,
                  },
                  optional: false,
                  computed: false,
                },
                property: {
                  type: 'Identifier',
                  ...range,
                  decorators: [],
                  name: 'accept',
                  optional: false,
                  typeAnnotation: null,
                },
                optional: false,
                computed: false,
              },
              typeArguments: null,
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  ...range,
                  expression: false,
                  async: false,
                  typeParameters: null,
                  params: [],
                  returnType: null,
                  body: {
                    type: 'BlockStatement',
                    ...range,
                    body: [
                      {
                        type: 'IfStatement',
                        ...range,
                        test: {
                          type: 'Identifier',
                          ...range,
                          decorators: [],
                          name: '_scriptChanged',
                          optional: false,
                          typeAnnotation: null,
                        },
                        consequent: {
                          type: 'BlockStatement',
                          ...range,
                          body: [
                            {
                              type: 'ExpressionStatement',
                              ...range,
                              expression: {
                                type: 'CallExpression',
                                ...range,
                                callee: {
                                  type: 'MemberExpression',
                                  ...range,
                                  object: {
                                    type: 'MemberExpression',
                                    ...range,
                                    object: {
                                      type: 'Identifier',
                                      ...range,
                                      decorators: [],
                                      name: 'window',
                                      optional: false,
                                      typeAnnotation: null,
                                    },
                                    property: {
                                      type: 'Identifier',
                                      ...range,
                                      decorators: [],
                                      name: 'location',
                                      optional: false,
                                      typeAnnotation: null,
                                    },
                                    optional: false,
                                    computed: false,
                                  },
                                  property: {
                                    type: 'Identifier',
                                    ...range,
                                    decorators: [],
                                    name: 'reload',
                                    optional: false,
                                    typeAnnotation: null,
                                  },
                                  optional: false,
                                  computed: false,
                                },
                                typeArguments: null,
                                arguments: [],
                                optional: false,
                              },
                              directive: null,
                            },
                          ],
                        },
                        alternate: {
                          type: 'BlockStatement',
                          ...range,
                          body: [
                            {
                              type: 'ExpressionStatement',
                              ...range,
                              expression: {
                                type: 'CallExpression',
                                ...range,
                                callee: {
                                  type: 'MemberExpression',
                                  ...range,
                                  object: {
                                    type: 'Identifier',
                                    ...range,
                                    decorators: [],
                                    name: '__VUE_HMR_RUNTIME__',
                                    optional: false,
                                    typeAnnotation: null,
                                  },
                                  property: {
                                    type: 'Identifier',
                                    ...range,
                                    decorators: [],
                                    name: 'rerender',
                                    optional: false,
                                    typeAnnotation: null,
                                  },
                                  optional: false,
                                  computed: false,
                                },
                                typeArguments: null,
                                arguments: [
                                  {
                                    type: 'MemberExpression',
                                    ...range,
                                    object: {
                                      type: 'Identifier',
                                      ...range,
                                      decorators: [],
                                      name: '_component',
                                      optional: false,
                                      typeAnnotation: null,
                                    },
                                    property: {
                                      type: 'Identifier',
                                      ...range,
                                      decorators: [],
                                      name: '__hmrId',
                                      optional: false,
                                      typeAnnotation: null,
                                    },
                                    optional: false,
                                    computed: false,
                                  },
                                  {
                                    type: 'MemberExpression',
                                    ...range,
                                    object: {
                                      type: 'Identifier',
                                      ...range,
                                      decorators: [],
                                      name: '_component',
                                      optional: false,
                                      typeAnnotation: null,
                                    },
                                    property: {
                                      type: 'Identifier',
                                      ...range,
                                      decorators: [],
                                      name: 'render',
                                      optional: false,
                                      typeAnnotation: null,
                                    },
                                    optional: false,
                                    computed: false,
                                  },
                                ],
                                optional: false,
                              },
                              directive: null,
                            },
                          ],
                        },
                      },
                    ],
                  },
                  id: null,
                  generator: false,
                },
              ],
              optional: false,
            },
            directive: null,
          },
        ],
      },
      alternate: null,
    },
  ]
}
