module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignorePatterns: [
    "node_modules/",
    "lib/",
    "dist/",
    "coverage/",
    "assets/",
    "api-reference/",
    "typedoc/",
    "build/",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "no-empty": "warn",
  },

  overrides: [
    {
      files: ["**/*.test.[jt]s?(x)"],
      env: {
        jest: true,
      },
      plugins: ["jest", "@typescript-eslint"],
      rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],
        "@typescript-eslint/ban-ts-comment": 0,
        "no-empty": "warn",
      },
    },
    {
      files: [
        "**/*.config.js",
        "**/.eslintrc.js",
        "docs/generate-reference-index.js",
      ],
      env: {
        node: true,
      },
      plugins: [],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
