module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jquery: true
  },
  extends: ['plugin:vue/essential', '@vue/standard', '@vue/typescript/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2020
  },
  ignorePatterns: ['__tests__/', '*.test.ts', '*.spec.ts', 'node_modules'],
  rules: {
    'linebreak-style': [0, 'unix'],
    'no-console': ['error', { allow: ['error', 'warn'] }],
    'no-debugger': 1,
    '@typescript-eslint/no-var-requires': 1,
    'prettier/prettier': 2,
    'space-before-function-paren': [0, 'always'],
    'no-useless-constructor': 0,
    '@typescript-eslint/no-useless-constructor': 2,
    'max-len': [
      2,
      {
        code: 120,
        tabWidth: 2,
        comments: 120,
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true
      }
    ],
    'no-multiple-empty-lines': [2, { max: 1 }],
    'padding-line-between-statements': [
      2,
      { blankLine: 'always', prev: '*', next: ['if', 'return'] },
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: ['const', 'let'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] }
    ],
    camelcase: 0,
    '@typescript-eslint/naming-convention': [
      2,
      {
        selector: 'typeProperty',
        format: ['camelCase', 'PascalCase', 'snake_case'],
        leadingUnderscore: 'allow'
      }
    ],
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }]
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ]
}
