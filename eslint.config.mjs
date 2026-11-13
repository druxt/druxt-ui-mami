// Flat config. ESLint reads only this file and never walks up past it, so a
// checkout inside another workspace is not linted by that workspace's rules.
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  {
    ignores: ['coverage/', 'dist/', 'node_modules/', 'reports/', '.vale/'],
  },
  js.configs.recommended,
  // Vue 2 rules: this branch is the Vue 2.7 package.
  ...vue.configs['flat/vue2-recommended'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
  },
  {
    // The Nuxt module and the tooling configs are CommonJS, run by Node.
    files: ['module.js', '*.config.js', 'babel.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.mjs'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['test/**/*.js'],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
  },
  // Last, so formatting rules that would fight Prettier are turned off.
  prettier,
]
