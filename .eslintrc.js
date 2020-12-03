module.exports = {
    root: true,
    env: {
        browser: true
    },
    extends: ['plugin:vue/essential'],
    plugins: ['vue'],
    rules: {
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-await-in-loop': 'error',
        'no-compare-neg-zero': 'error',
        'no-cond-assign': 'error',
        'no-dupe-args': 'error',
        'no-dupe-keys': 'error',
        'no-empty': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unreachable': 'error',
        eqeqeq: 'off',
        'no-var': 'off',
        'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
