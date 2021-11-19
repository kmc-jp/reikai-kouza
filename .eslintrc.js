module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "sourceType": "module",
    "project": "./tsconfig.json",
  },
  root: true,
  rules: {},
}
