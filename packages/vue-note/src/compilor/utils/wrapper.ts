import type { Directive, Expression, Statement } from 'oxc-parser'
import { parseSync } from 'oxc-parser'

export function wrapperComponent(definention: Expression, injectedCode: (Directive | Statement)[] | string, template?: Statement): Expression {
  const range = { start: 0, end: 0 }

  let inject: (Directive | Statement)[]
  if (typeof injectedCode === 'string') {
    const { program } = parseSync('foo.ts', injectedCode)
    inject = program.body
  }
  else {
    inject = injectedCode
  }

  return {
    type: 'CallExpression',
    ...range,
    typeArguments: null,
    arguments: [],
    optional: false,
    callee: {
      type: 'ParenthesizedExpression',
      ...range,
      expression: {
        type: 'ArrowFunctionExpression',
        ...range,
        body: {
          type: 'BlockStatement',
          ...range,
          body: [
            {
              type: 'VariableDeclaration',
              ...range,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  ...range,
                  id: {
                    type: 'Identifier',
                    ...range,
                    decorators: [],
                    name: '_component',
                    optional: false,
                    typeAnnotation: null,
                  },
                  init: definention,
                  definite: false,
                },
              ],
              kind: 'const',
              declare: false,
            },
            ...getTemplatInject(template, range),
            ...inject,
            {
              type: 'ReturnStatement',
              ...range,
              argument: {
                type: 'Identifier',
                ...range,
                decorators: [],
                name: '_component',
                optional: false,
                typeAnnotation: null,
              },
            },
          ],
        },
        expression: false,
        async: false,
        typeParameters: null,
        params: [],
        returnType: null,
        id: null,
        generator: false,
      },
    },
  }
}

function getTemplatInject(template: Statement | undefined, range = { start: 0, end: 0 }): Statement[] {
  return (template
    ? [
        template,
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
                name: 'render',
                optional: false,
                typeAnnotation: null,
              },
              optional: false,
              computed: false,
            },
            right: {
              type: 'Identifier',
              ...range,
              decorators: [],
              name: 'render',
              optional: false,
              typeAnnotation: null,
            },
          },
          directive: null,
        },
      ]
    : [])
}
