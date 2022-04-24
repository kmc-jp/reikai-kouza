module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jest/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    "no-console": "error",
    "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "parent", "sibling", "index", "object", "type"],
        pathGroups: [
          {
            pattern: "@alias/**",
            group: "type",
            position: "after",
          },
        ],
        alphabetize: {
          order: "asc",
        },
        "newlines-between": "always",
      },
    ],
  },
};
