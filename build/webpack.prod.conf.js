var path = require('path')
var packageConfig = require('../package.json')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var manifestPwaCfg = require('./manifest/' + process.env.REGION)
const { merge } = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
var WebpackPwaManifest = require('webpack-pwa-manifest')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        cache: true,
        parallel: 4,
        sourceMap: config.build.productionSourceMap,
        terserOptions: {
          compress: true,
          warnings: false
        }
      }),
      new OptimizeCSSPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }]
        }
        // cssProcessorOptions: { safe: true }
      })
    ],
    runtimeChunk: false,
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    // DefinePlugin allows you to create global constants which can be configured at compile time
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      chunkFilename: utils.assetsPath('css/[id].css'),
      ignoreOrder: true
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      favicon: path.resolve(__dirname, '../src/assets/images/loghi/' + process.env.REGION + '/pwa_favicon.png'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // https://github.com/arthurbergmz/webpack-pwa-manifest
    new WebpackPwaManifest(merge(manifestPwaCfg, {
      inject: true,
      icons: [
        {
          src: path.resolve(__dirname, '../src/assets/images/loghi/' + process.env.REGION + '/pwa_favicon.png'),
          destination: config.build.assetsSubDirectory + '/img/icons',
          sizes: [16, 32]
        },
        {
          src: path.resolve(__dirname, '../src/assets/images/loghi/' + process.env.REGION + '/pwa_manifest.png'),
          destination: config.build.assetsSubDirectory + '/img/icons',
          sizes: [48, 72, 96, 144, 192, 512]
        }
      ]
    })),
    new SWPrecacheWebpackPlugin({
      cacheId: 'bolloweb-cache-v' + packageConfig.version,
      filename: 'tassa-auto-service-worker.js'
    })
  ]
})

module.exports = webpackConfig
