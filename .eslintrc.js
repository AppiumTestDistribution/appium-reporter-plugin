module.exports = {
    env: {
        node: true,
        es6: true,
        mocha: true,
    },
    extends: [
        'eslint:recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2016,
      sourceType: 'module',
    },
    'overrides': [
    ],
    plugins: ['prettier'],
    'rules': {
        'semi': ['error', 'always'],
        'quotes': ['error', 'single']
    }
};
