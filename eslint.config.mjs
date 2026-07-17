import globals from 'globals'
import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import tsEslintParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  { files: ['**/*.{js,ts}'] },
  { languageOptions: { globals: globals.node, parser: tsEslintParser } },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.stylistic,
  // ...tsEslint.configs.recommendedTypeChecked,
  // {
  //   languageOptions: {
  //     parserOptions: {
  //       projectService: true,
  //       tsconfigRootDir: import.meta.dirname
  //     }
  //   }
  // },
  // ...tsEslint.configs.strictTypeChecked,
  // ...tsEslint.configs.stylisticTypeChecked,
  {
    ignores: ['.aws-sam', 'dist/', 'node_modules', 'eslint.config.mjs']
  },
  {
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none'
        }
      ]
    }
  },
  {
    files: [
      'tests/**/*.ts',
      'scripts/**/*.ts',
      // add splunk to ignore list as we use console.log for int and e2e test logs
      'common/services/splunk/*'
    ],
    rules: { 'no-console': ['off'], '@typescript-eslint/no-empty-function': 'off' }
  },
  eslintConfigPrettier
]
