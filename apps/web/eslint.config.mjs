import { defineConfig } from 'eslint/config'
import nextPlugin from 'eslint-config-next'

export default defineConfig([
  ...nextPlugin,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
])

