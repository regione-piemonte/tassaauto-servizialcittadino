// see http://vuejs-templates.github.io/webpack for documentation.
const { merge } = require('webpack-merge')
const path = require('path')

module.exports = {
  build: {
    env: merge(require('./' + process.env.CSI_ENV), { TARGET_REGION: '"' + process.env.REGION + '"' }),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false
  },
  dev: {
    env: merge(require('./dev.env'), { TARGET_REGION: '"' + process.env.REGION + '"' }),
    port: 8080,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
