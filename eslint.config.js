import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
    },
  },
  {
    // Vendored registry code — Vercel AI Elements components and the ui
    // primitives they pulled in export hooks, contexts, variants and helpers
    // alongside components by design. The fast-refresh rule is HMR-only and
    // not applicable to vendored code.
    files: [
      'src/components/ai-elements/**/*.{js,jsx}',
      'src/components/ui/{button-group,input-group,command,collapsible,hover-card,dropdown-menu,scroll-area,spinner}.jsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
