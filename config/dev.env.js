const { merge } = require('webpack-merge')
const devCsiEnv = require('./dev_csi.env')
// const devCsiEnv = require('./test_csi.env')

module.exports = merge(devCsiEnv, {
  NODE_ENV: '"development"'
})
