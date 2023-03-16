const path = require('path')
const packageConfig = require('../package.json')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const manifestPwaCfg = require('./manifest/' + process.env.REGION)
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

const webpackConfig = merge(baseWebpackConfig, {
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
        parallel: 4,
        terserOptions: {
          compress: true
        }
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      })
    ],
    moduleIds: 'deterministic',
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
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
    new GenerateSW({
      cacheId: 'bolloweb-cache-v' + packageConfig.version,
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      swDest: 'tassa-auto-service-worker.js'
    })
  ]
})

module.exports = webpackConfig
