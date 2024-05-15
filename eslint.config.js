// @ts-check
import hyoban, { DEFAULT_GLOB_TS_SRC } from 'eslint-config-hyoban'

export default hyoban(
  {
    react: 'vite',
    restrictedSyntax: ['ExportAllDeclaration'],
  },
  {
    files: DEFAULT_GLOB_TS_SRC,
    ignores: ['**/*.config.{js,ts}', 'src/components/auto-form/fields/**/*'],
    rules: {
      'no-restricted-exports': ['error', { restrictDefaultExports: { direct: true } }],
    },
  },
)
