import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  // Base JS config
  js.configs.recommended,

  // Global settings
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      ...typescript.configs["recommended"].rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // React files
  {
    files: ["**/*.jsx", "**/*.tsx", "**/*.js", "**/*.ts"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
    },
  },

  // Remix app specific
  {
    files: ["apps/remix/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-console": "warn",
    },
  },

  // Scripts app specific
  {
    files: ["apps/scripts/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-console": "off", // Allow console logs in scripts
    },
  },
];
