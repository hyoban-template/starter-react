import process from "node:process"
import react from "@eslint-react/eslint-plugin"
import ts from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import eslintConfigPrettier from "eslint-config-prettier"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import eslintPluginUnicorn from "eslint-plugin-unicorn"

const isInEditor = !!(
  (process.env.VSCODE_PID || process.env.JETBRAINS_IDE) &&
  !process.env.CI
)

export default [
  // don't lint js files
  {
    ignores: [
      "**/*.js",
      "**/*.cjs",
      "**/*.mjs",
      ...(isInEditor ? [] : ["src/components/ui/**/*.tsx"]),
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      "@typescript-eslint": ts,
    },
    rules: {
      ...ts.configs["eslint-recommended"].overrides[0].rules,
      ...ts.configs["strict-type-checked"].rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-non-null-assertion": "off",

      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",

      "no-console": ["warn", { allow: ["warn", "error"] }],

      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],

      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message: "We should not use Enum",
        },
      ],
    },
  },
  {
    ...eslintPluginUnicorn.configs["flat/recommended"],
    rules: {
      ...eslintPluginUnicorn.configs["flat/recommended"].rules,
      "unicorn/prevent-abbreviations": "off",
      "unicorn/catch-error-name": "off",
      // https://github.com/sindresorhus/meta/discussions/7
      "unicorn/no-null": "off",
      // https://github.com/orgs/web-infra-dev/discussions/10
      "unicorn/prefer-top-level-await": "off",
      "unicorn/no-array-reduce": "off",
    },
  },
  // React Hooks rules
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  // React rules
  {
    ...react.configs.all,
    rules: {
      ...react.configs.all.rules,
      "@eslint-react/naming-convention/filename": "off",
    },
  },
  {
    ignores: [
      // https://nextjs.org/docs/getting-started/project-structure#routing-files
      "src/app/**/{layout,page,loding,not-found,error,global-error,route,template,default}.tsx",
      "src/components/auto-form/fields/**/*.tsx",
    ],
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // disable export * and enum
      "no-restricted-syntax": [
        "error",
        {
          selector: ":matches(ExportAllDeclaration)",
          message: "Export only modules you need.",
        },
      ],
      "no-restricted-exports": [
        "error",
        {
          restrictDefaultExports: { direct: true },
        },
      ],
    },
  },
  // disable formatting rules, make sure to put this last
  eslintConfigPrettier,
]
