var path = require('path')
var config = require('../config')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  // cssLoader, loader sempre presente
  var cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified (which is the case during production build)
    if (options.extract) {
      return [MiniCssExtractPlugin.loader].concat(loaders)
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    // postcss: generateLoaders(), // Da attivare in presenza di file di stile postcss
    // less: generateLoaders('less'), // Da attivare in presenza di file di stile less
    sass: generateLoaders('sass', {
      implementation: require('sass'),
      sassOptions: {
        fiber: require('fibers')
      },
      additionalData: "@import '@/assets/stylesheets/variables-vuetify.scss'"
    }),
    scss: generateLoaders('sass', {
      implementation: require('sass'),
      sassOptions: {
        fiber: require('fibers')
      },
      additionalData: "@import '@/assets/stylesheets/variables-vuetify.scss'; $region: " + process.env.REGION + ';'
    })
    // stylus: generateLoaders('stylus'), // Da attivare in presenza di file di stile stylus
    // styl: generateLoaders('stylus') // Da attivare in presenza di file di stile styl
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    // a ciascuna estensione (css, postcss, sass, scss, etc) viene associato il loader corretto
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
