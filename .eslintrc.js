"use strict";
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
  },
  globals: {
    module: "writable",
    require: "writable",
    exports: "writable",
  },
  ignorePatterns: ["lessons/**/*.js"],
  rules: {
    // Possible Errors
    "no-unsafe-optional-chaining": 2,
    "no-useless-backreference": 2,

    // Best Practices
    "array-callback-return": 2,
    "block-scoped-var": 2,
    curly: [2, "multi-line"],
    "dot-location": [2, "property"],
    "no-empty-function": 2,
    "no-eq-null": 2,
    "no-floating-decimal": 2,
    "no-implicit-coercion": 2,
    "no-implied-eval": 2,
    "no-lone-blocks": 2,
    "no-multi-spaces": 2,
    "no-param-reassign": [2, { props: false }],
    "no-return-assign": [2, "always"],
    "no-sequences": 2,
    "no-unmodified-loop-condition": 2,
    "no-useless-call": 2,
    "no-useless-concat": 2,
    "prefer-named-capture-group": 2,
    "require-await": 2,
    "require-unicode-regexp": 2,
    yoda: 2,

    // Strict Mode
    strict: [0, "global"],

    // Variables
    "no-shadow": [
      2,
      {
        builtinGlobals: true,
        hoist: "functions",
        allow: [],
      },
    ],

    // Stylistic Issues
    "array-bracket-spacing": [2, "never"],
    "block-spacing": [2, "always"],
    "brace-style": [2, "1tbs", { allowSingleLine: true }],
    "comma-dangle": [
      0,
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "always-multiline",
      },
    ],
    "comma-spacing": [2, { after: true }],
    "comma-style": [2, "last"],
    "func-call-spacing": [2, "never"],
    "function-paren-newline": [2, "multiline"],
    "implicit-arrow-linebreak": [2, "beside"],
    indent: [
      "error",
      2,
      {
        SwitchCase: 0,
        outerIIFEBody: "off",
        MemberExpression: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: "off" },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: true,
        offsetTernaryExpressions: false,
        // "ignoredNodes"
      },
    ],
    "key-spacing": [
      2,
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    "keyword-spacing": [
      2,
      {
        before: false,
        after: true,
        overrides: {
          else: { before: true },
        },
      },
    ],
    "linebreak-style": [2, "unix"],
    "multiline-ternary": [2, "always-multiline"],
    "newline-per-chained-call": [2, { ignoreChainWithDepth: 3 }],
    "no-multi-assign": 2,
    "no-multiple-empty-lines": [
      2,
      {
        max: 2,
        maxEOF: 0,
      },
    ],
    "no-trailing-spaces": 2,
    "no-unneeded-ternary": 2,
    "no-whitespace-before-property": 2,
    "nonblock-statement-body-position": [2, "beside"],
    "object-curly-newline": [
      2,
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        ObjectPattern: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        ImportDeclaration: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
      },
    ],
    "object-curly-spacing": [2, "always", { objectsInObjects: false }],
    "object-property-newline": [2, { allowAllPropertiesOnSameLine: true }],
    "padding-line-between-statements": [
      2,
      {
        blankLine: "always",
        prev: "for",
        next: "*",
      },
      {
        blankLine: "always",
        prev: "function",
        next: "*",
      },
      {
        blankLine: "always",
        prev: "while",
        next: "*",
      },
    ],
    "quote-props": [2, "consistent"],
    quotes: [2, "double"],
    semi: [2, "always"],
    "semi-spacing": 2,
    "space-before-blocks": [2, "always"],
    "space-before-function-paren": [
      2,
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      },
    ],
    "space-in-parens": [2, "never"],
    "spaced-comment": 2,
    // ES 6
    "arrow-body-style": [2, "always"],
    "arrow-parens": [2, "always"],
    "arrow-spacing": [
      2,
      {
        before: true,
        after: true,
      },
    ],
    "no-confusing-arrow": 2,
    "object-shorthand": 2,
    "prefer-destructuring": 1,
    "template-curly-spacing": [2, "never"],
  },
};
