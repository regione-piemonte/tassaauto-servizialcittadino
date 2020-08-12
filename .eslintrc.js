// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 10,
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  env: {
    browser: true,
  },
  extends: [
    'standard',  // 'standard' (necessita di 'eslint-config-standard', che a sua volta necessita di 'eslint-plugin-import', 'eslint-plugin-node', 'eslint-plugin-promise', 'eslint-plugin-standard'
    'plugin:vue/base'
  ],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
