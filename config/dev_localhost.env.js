const { merge } = require('webpack-merge')
var devCsiEnv = require('./dev_remote.env')

module.exports = merge(devCsiEnv, {
  NODE_ENV: '"development"'
})
