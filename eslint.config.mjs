import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
   {parser: "@typescript-eslint/parser", parserOptions: {project: "./tsconfig.json"}},
   {rules: {
     "no-console": "off",
     "no-debugger": "off",
   }},
   {overrides: [{files: ["**/__tests__/*.{js,mjs,cjs,ts}"]}]},
   {rules: {
     "no-unused-vars": "off",
     "@typescript-eslint/no-unused-vars": ["error", {args: "all", argsIgnorePattern: "^_"}],
     "no-unused-imports": "off",
     "@typescript-eslint/no-unused-imports": ["error", {ignoreTypeImports: true}],
     "no-useless-constructor": "off",
     "@typescript-eslint/no-useless-constructor": "error",
     "no-empty-function": "off",
     "@typescript-eslint/no-empty-function": ["error", {allow: ["arrow-function"]}],
     "prettier/prettier": ["error", {useTabs: false}],
     "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
       "newlines-between": "always",
     }],
     "import/no-duplicates": "error",
     "import/no-unresolved": "error",
   }},
];