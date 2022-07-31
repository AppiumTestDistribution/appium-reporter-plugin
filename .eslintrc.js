module.exports = {
  env: {
    node: true,
    es6: true,
    mocha: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 8,
    requireConfigFile: false,
    sourceType: 'module',
    babelOptions: {
      plugins: ['@babel/plugin-proposal-class-properties'],
    },
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    quotes: ['error', 'single'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
      },
    },
  },
};
