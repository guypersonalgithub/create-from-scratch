// import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
// import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
// import { fixupConfigRules } from "@eslint/compat";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import stylisticJs from "@stylistic/eslint-plugin-js";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";

export default [
  // { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      prettier: eslintPluginPrettier,
      "@stylistic/js": stylisticJs,
      "react-hooks": eslintPluginReactHooks,
    },
    rules: {
      "prettier/prettier": "error",
      "@stylistic/js/padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "function" },
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
      ],
      "newline-before-return": "error",
      "react-hooks/exhaustive-deps": "off",
    },
    env: {
      node: true,
      es6: true,
    },
    parser: "@typescript-eslint/parser",
  },
  // ...fixupConfigRules(pluginReactConfig),
];
